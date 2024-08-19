import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from '@coral-xyz/anchor';
import { BankrunProvider } from 'anchor-bankrun';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { createAccount, createMint, mintTo } from 'spl-token-bankrun';
import { PythSolanaReceiver } from '@pythnetwork/pyth-solana-receiver';

import {
  startAnchor,
  Clock,
  BanksClient,
  ProgramTestContext,
} from 'solana-bankrun';

import { PublicKey, Keypair } from '@solana/web3.js';

// @ts-ignore
import IDL from '../target/idl/lending_protocol.json';
import { LendingProtocol } from '../target/types/lending_protocol';
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system';
import { BankrunContextWrapper } from './bankrun-utils/bankrunConnection';

describe('Lending Smart Contract Tests', () => {
  let signer: Keypair;
  let usdcBankAccount: PublicKey;
  let solBankAccount: PublicKey;

  let solTokenAccount: PublicKey;
  let provider: BankrunProvider;
  let program: Program<LendingProtocol>;
  let banksClient: BanksClient;
  let context: ProgramTestContext;
  let bankrunContextWrapper: BankrunContextWrapper;

  it('create banks and user account', async () => {
    // const provider = anchor.AnchorProvider.env();
    // const connection = provider.connection;
    // const wallet = provider.wallet as anchor.Wallet;
    // anchor.setProvider(provider);

    // const program = anchor.workspace
    //   .LendingProtocol as Program<LendingProtocol>;

    context = await startAnchor(
      '',
      [{ name: 'lending', programId: new PublicKey(IDL.address) }],
      []
    );
    provider = new BankrunProvider(context);

    bankrunContextWrapper = new BankrunContextWrapper(context);

    const connection = bankrunContextWrapper.connection.toConnection();

    const pythSolanaReceiver = new PythSolanaReceiver({
      connection,
      wallet: provider.wallet,
    });

    const SOL_PRICE_FEED_ID =
      '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d';

    const solUsdPriceFeedAccount = pythSolanaReceiver
      .getPriceFeedAccountAddress(0, SOL_PRICE_FEED_ID)
      .toBase58();

    console.log(solUsdPriceFeedAccount);

    program = new Program<LendingProtocol>(IDL as LendingProtocol, provider);

    banksClient = context.banksClient;

    signer = provider.wallet.payer;

    const mintUSDC = await createMint(
      // @ts-ignore
      banksClient,
      signer,
      signer.publicKey,
      null,
      2
    );

    const mintSOL = await createMint(
      // @ts-ignore
      banksClient,
      signer,
      signer.publicKey,
      null,
      2
    );

    [usdcBankAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury'), mintUSDC.toBuffer()],
      program.programId
    );

    [solBankAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury'), mintSOL.toBuffer()],
      program.programId
    );

    [solTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury'), mintSOL.toBuffer()],
      program.programId
    );

    console.log('USDC Bank Account', usdcBankAccount.toBase58());

    console.log('SOL Bank Account', solBankAccount.toBase58());

    const initUserTx = await program.methods
      .initUser()
      .accounts({
        signer: signer.publicKey,
      })
      .rpc({ commitment: 'confirmed' });

    console.log('Create User Account', initUserTx);

    const initUSDCBankTx = await program.methods
      .initBank(new BN(0), new BN(0))
      .accounts({
        signer: signer.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' });

    console.log('Create USDC Bank Account', initUSDCBankTx);

    const amount = 10_000 * 10 ** 9;
    const mintTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      usdcBankAccount,
      signer,
      amount
    );

    console.log('Mint to USDC Bank Signature:', mintTx);

    const initSOLBankTx = await program.methods
      .initBank(new BN(0), new BN(0))
      .accounts({
        signer: signer.publicKey,
        mint: mintSOL,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' });

    console.log('Create SOL Bank Account', initSOLBankTx);

    const mintSOLTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintSOL,
      solBankAccount,
      signer,
      amount
    );

    console.log('Mint to USDC Bank Signature:', mintSOLTx);

    const USDCTokenAccount = await createAccount(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      signer.publicKey
    );

    console.log('Mint to USDC Bank Signature:', USDCTokenAccount);

    const mintUSDCTx = await mintTo(
      // @ts-ignores
      banksClient,
      signer,
      mintUSDC,
      USDCTokenAccount,
      signer,
      amount
    );

    console.log('Mint to USDC Bank Signature:', mintUSDCTx);

    const depositUSDC = await program.methods
      .deposit(new BN(10))
      .accounts({
        signer: signer.publicKey,
        mint: mintUSDC,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: 'confirmed' });

    console.log('Deposit USDC', depositUSDC);

    // const borrowSOL = await program.methods
    //   .borrow(new BN(1))
    //   .accounts({
    //     signer: signer.publicKey,
    //     mint: mintSOL,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //     priceUpdate:
    //   })
    //   .rpc({ commitment: 'confirmed' });

    // console.log('Deposit USDC', borrowSOL);
  });
});
