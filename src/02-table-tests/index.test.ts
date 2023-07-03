// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';
import each from 'jest-each';
const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 15, b: 2, action: Action.Subtract, expected: 13 },
  { a: 4, b: 2, action: Action.Multiply, expected: 8 },
  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 2, b: 5, action: Action.Exponentiate, expected: 32 },
  { a: 2, b: 3, action: ':', expected: null },
  { a: '2', b: 3, action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  each(testCases).test(`should  to equal `, ({ a, b, action, expected }) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBe(expected);
  });
});
