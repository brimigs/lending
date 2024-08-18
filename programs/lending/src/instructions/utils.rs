// use anchor_lang::prelude::*;
// use pyth_solana_receiver_sdk::price_update::{get_feed_id_from_hex, PriceUpdateV2};

// // Calculating user health factor 
// // Convert All Assets to a Common Unit: Typically, this would be a stable currency like USD.
// // Apply Asset-Specific Adjustments: Multiply each asset's value by its respective liquidation threshold.
// // Sum Up Values: Add up all the adjusted values to get the total collateral.

// pub fn check_health_factor( ) -> Result<(
//     user: &Account<User>,
// )> { 
//     let sol_address = 
//     let sol_value = get_usdc_value()?;     
//     Ok(())
// }

// // Given lamports, return USD value based on current SOL price.
// fn get_usd_value(amount_in_lamports: &u64, price_feed: &Account<PriceUpdateV2>) -> Result<u64> {
//     let feed_id = get_feed_id_from_hex(FEED_ID)?;
//     let price = price_feed.get_price_no_older_than(&Clock::get()?, MAXIMUM_AGE, &feed_id)?;

//     // Check price is positive
//     require!(price.price > 0, CustomError::InvalidPrice);

//     // Adjust price to match lamports precision (9 decimals)
//     // Example: Assuming 1 SOL = $2.00
//     // price.price = 200_000_000 (from Pyth, 8 decimals)
//     // price_in_usd = 200_000_000 * 10 = 2_000_000_000 (9 decimals)
//     let price_in_usd = price.price as u128 * PRICE_FEED_DECIMAL_ADJUSTMENT;

//     // Calculate USD value
//     // Example: Convert 0.5 SOL to USD when 1 SOL = $2.00
//     // amount_in_lamports = 500_000_000 (0.5 SOL)
//     // price_in_usd = 2_000_000_000 (as calculated above)
//     // LAMPORTS_PER_SOL = 1_000_000_000
//     // amount_in_usd = (500_000_000 * 2_000_000_000) / 1_000_000_000 = 1_000_000_000 ($1.00)
//     let amount_in_usd = (*amount_in_lamports as u128 * price_in_usd) / (LAMPORTS_PER_SOL as u128);

//     // EXAMPLE LOGS
//     // Program log: Price in USD (for 1 SOL): 136.194634200
//     // Program log: SOL Amount: 0.500000000
//     // Program log: USD Value: 68.097317100
//     // Program log: Outstanding Token Amount (Minted): 1.500000000
//     // Program log: Health Factor: 22
//     msg!("*** CONVERT USD TO SOL ***");
//     msg!("SOL/USD Price : {:.9}", price_in_usd as f64 / 1e9);
//     msg!("SOL Amount    : {:.9}", *amount_in_lamports as f64 / 1e9);
//     msg!("USD Value     : {:.9}", amount_in_usd as f64 / 1e9);
//     // msg!("Price exponent?: {}", price.exponent);

//     Ok(amount_in_usd as u64)
// }


// pub fn calculate_compound_interest() -> Result<()> { 
//     // Calculate interest based on the user's borrowed assets
//     // Update the user's borrowed assets
//     Ok(())
// }