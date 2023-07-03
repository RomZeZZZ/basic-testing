// Uncomment the code below and write your tests
import { existsSync } from 'fs';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import path from 'path';
import { readFile } from 'fs/promises';
jest.mock('fs');
jest.mock('path');
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));
describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(callback, timeout);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 2000;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1500);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, timeout);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, timeout);
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, timeout);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, timeout);
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).not.toHaveBeenCalledTimes(4);
    expect(callback).not.toHaveBeenCalledTimes(2);
    setIntervalSpy.mockRestore();
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'file.txt';
    const joinMock = jest.spyOn(path, 'join');
    await readFileAsynchronously(pathToFile);
    expect(joinMock).toHaveBeenCalledWith(__dirname, pathToFile);
    joinMock.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'file.txt';
    const fileContent = 'File content';
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(fileContent);
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);
  });
});
