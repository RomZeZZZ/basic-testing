// Uncomment the code below and write your tests
import _ from 'lodash';
import { getBankAccount } from '.';
import { InsufficientFundsError } from './index';
import { TransferFailedError } from './index';
import { SynchronizationFailedError } from './index';
describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    const withdrawAmount = initialBalance + 100;
    expect(() => account.withdraw(withdrawAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    const toAccount = getBankAccount(initialBalance);
    const transferAmount = initialBalance + 100;
    expect(() => account.transfer(transferAmount, toAccount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    expect(() => account.transfer(initialBalance, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    const depositAmount = 600;
    account.deposit(depositAmount);
    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 1000;
    const account = getBankAccount(initialBalance);
    const withdrawAmount = 1;
    account.withdraw(withdrawAmount);
    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const accountInitialBalance = 1000;
    const toAccountInitialBalance = 2000;
    const account = getBankAccount(accountInitialBalance);
    const toAccount = getBankAccount(toAccountInitialBalance);
    const transferAmount = 500;
    account.transfer(transferAmount, toAccount);
    expect(account.getBalance()).toBe(accountInitialBalance - transferAmount);
    expect(toAccount.getBalance()).toBe(
      toAccountInitialBalance + transferAmount,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomMock = jest
      .spyOn(_, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);
    const account = getBankAccount(0);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
    randomMock.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(50);
    const mockBalance = 0;
    const fetchBalanceMock = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValueOnce(mockBalance);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(mockBalance);
    fetchBalanceMock.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(50);
    const fetchBalanceMock = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValueOnce(null);

    expect(async () => await account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );

    fetchBalanceMock.mockRestore();
  });
});
