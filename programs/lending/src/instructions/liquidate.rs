use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{ self, Mint, TokenAccount, TokenInterface, TransferChecked };
use pyth_solana_receiver_sdk::price_update::{get_feed_id_from_hex, PriceUpdateV2};
use crate::constants::{MAXIMUM_AGE, SOL_USD_FEED_ID, USDC_USD_FEED_ID};
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct Liquidate<'info> {
    #[account(mut)]
    pub liquidator: Signer<'info>,
    pub price_update: Account<'info, PriceUpdateV2>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut, 
        seeds = [mint.key().as_ref()],
        bump,
    )]  
    pub bank: Account<'info, Bank>,
    #[account(
        mut, 
        seeds = [b"treasury", mint.key().as_ref()],
        bump, 
    )]  
    pub bank_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut, 
        seeds = [liquidator.key().as_ref()],
        bump,
    )]  
    pub user_account: Account<'info, User>,
    #[account( 
        init_if_needed, 
        payer = liquidator,
        associated_token::mint = mint, 
        associated_token::authority = liquidator,
        associated_token::token_program = token_program,
    )]
    pub liquidator_token_account: InterfaceAccount<'info, TokenAccount>, 
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

// 1. Check if user is undercollateralized
// 2. Calculate liquidation amount
// 3. Make a CPI transfer from the user's token account to the bank's token account
// 4. Update the user and bank states
// 5. Handle fees and rewards 

pub fn process_liquidate(ctx: Context<Liquidate>) -> Result<()> { 
    let bank = &mut ctx.accounts.bank;
    let user = &mut ctx.accounts.user_account;

    let price_update = &mut ctx.accounts.price_update;

    let sol_feed_id = get_feed_id_from_hex(SOL_USD_FEED_ID)?; 
    let usdc_feed_id = get_feed_id_from_hex(USDC_USD_FEED_ID)?;

    let sol_price = price_update.get_price_no_older_than(&Clock::get()?, MAXIMUM_AGE, &sol_feed_id)?;
    let usdc_price = price_update.get_price_no_older_than(&Clock::get()?, MAXIMUM_AGE, &usdc_feed_id)?;

    // Note: For simplicity, interest is not being included in these calculations. 

    let total_collateral = (sol_price.price as u64 * user.deposited_sol) + (usdc_price.price as u64 * user.deposited_usdc);
    let total_borrowed = (sol_price.price as u64 * user.borrowed_sol) + (usdc_price.price as u64 * user.borrowed_usdc);    

    let health_factor = (total_collateral * bank.max_ltv)/total_borrowed;

    if health_factor >= 1 {
        return Err(ErrorCode::NotUndercollateralized.into());
    }

    let liquidation_amount = total_borrowed * bank.liquidation_close_factor;
    let liquidation_bonus = liquidation_amount * bank.liquidation_bonus;

    // FIXME: Update authority's for token accounts?? Smart contract should be able to make the transfer 

    // Transfer liquidation amount to bank
    let transfer_to_bank = TransferChecked {
        from: ctx.accounts.liquidator_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.bank_token_account.to_account_info(),
        authority: ctx.accounts.liquidator.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx_to_bank = CpiContext::new(cpi_program.clone(), transfer_to_bank);
    let decimals = ctx.accounts.mint.decimals;

    token_interface::transfer_checked(cpi_ctx_to_bank, liquidation_amount, decimals)?;

    // Transfer liquidation bonus to liquidator

    let transfer_to_liquidator = TransferChecked {
        from: ctx.accounts.bank_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.liquidator_token_account.to_account_info(),
        authority: ctx.accounts.liquidator.to_account_info(),
    };
    let cpi_ctx_to_liquidator = CpiContext::new(cpi_program.clone(), transfer_to_liquidator);
    token_interface::transfer_checked(cpi_ctx_to_liquidator, liquidation_bonus, decimals)?;

    Ok(())
}