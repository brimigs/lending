// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { LendingProtocol } from '../target/types/lending_protocol';
// import { PythSolanaReceiver } from '@pythnetwork/pyth-solana-receiver';
// import { create } from 'domain';
// import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';

// describe('stablecoin', () => {
//   const provider = anchor.AnchorProvider.env();
//   const connection = provider.connection;
//   const wallet = provider.wallet as anchor.Wallet;
//   anchor.setProvider(provider);

//   const program = anchor.workspace.Stablecoin as Program<LendingProtocol>;

//   const pythSolanaReceiver = new PythSolanaReceiver({ connection, wallet });
//   const SOL_PRICE_FEED_ID =
//     '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';
//   const solUsdPriceFeedAccount = pythSolanaReceiver
//     .getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID)
//     .toBase58();

//   console.log(solUsdPriceFeedAccount);

//   //   it('Is initialized!', async () => {
//   //     const mintUSDC = await createMint(
//   //       connection,
//   //       wallet.payer,
//   //       wallet.publicKey,
//   //       null,
//   //       2
//   //     );

//   //     const mintSOL = await createMint(
//   //       connection,
//   //       wallet.payer,
//   //       wallet.publicKey,
//   //       null,
//   //       2
//   //     );

//   //     const [usdcBankAccount] = anchor.web3.PublicKey.findProgramAddressSync(
//   //       [Buffer.from('treasury'), mintUSDC.toBuffer()],
//   //       program.programId
//   //     );

//   //     const [solBankAccount] = anchor.web3.PublicKey.findProgramAddressSync(
//   //       [Buffer.from('treasury'), mintSOL.toBuffer()],
//   //       program.programId
//   //     );

//   //     console.log('USDC Bank Account', usdcBankAccount.toBase58());

//   //     console.log('SOL Bank Account', solBankAccount.toBase58());

//   //     const initUserTx = await program.methods
//   //       .initUser()
//   //       .accounts({
//   //         signer: wallet.publicKey,
//   //       })
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Create User Account', initUserTx);

//   //     const initUSDCBankTx = await program.methods
//   //       .initBank(new anchor.BN(85), new anchor.BN(75))
//   //       .accounts({
//   //         signer: wallet.publicKey,
//   //         mint: mintUSDC,
//   //         tokenProgram: TOKEN_PROGRAM_ID,
//   //       })
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Create USDC Bank Account', initUSDCBankTx);
//   //   });

//   //   it('Deposit Collateral and Mint USDS', async () => {
//   //     const amountCollateral = 1_000_000_000;
//   //     const amountToMint = 1_000_000_000;
//   //     const tx = await program.methods
//   //       .depositCollateralAndMint(
//   //         new anchor.BN(amountCollateral),
//   //         new anchor.BN(amountToMint)
//   //       )
//   //       .accounts({ priceUpdate: solUsdPriceFeedAccount })
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Your transaction signature', tx);
//   //   });

//   //   it('Redeem Collateral and Burn USDS', async () => {
//   //     const amountCollateral = 500_000_000;
//   //     const amountToBurn = 500_000_000;
//   //     const tx = await program.methods
//   //       .redeemCollateralAndBurnTokens(
//   //         new anchor.BN(amountCollateral),
//   //         new anchor.BN(amountToBurn)
//   //       )
//   //       .accounts({ priceUpdate: solUsdPriceFeedAccount })
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Your transaction signature', tx);
//   //   });

//   //   // Increase minimum health threshold to test liquidate
//   //   it('Update Config', async () => {
//   //     const tx = await program.methods
//   //       .updateConfig(new anchor.BN(100))
//   //       .accounts({})
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Your transaction signature', tx);
//   //   });

//   //   it('Liquidate', async () => {
//   //     const amountToBurn = 500_000_000;
//   //     const tx = await program.methods
//   //       .liquidate(new anchor.BN(amountToBurn))
//   //       .accounts({ collateralAccount, priceUpdate: solUsdPriceFeedAccount })
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Your transaction signature', tx);
//   //   });

//   //   it('Update Config', async () => {
//   //     const tx = await program.methods
//   //       .updateConfig(new anchor.BN(1))
//   //       .accounts({})
//   //       .rpc({ skipPreflight: true, commitment: 'confirmed' });
//   //     console.log('Your transaction signature', tx);
//   //   });
// });
