import { getSeedMaxAmount } from '../get-seed-max-amount';

describe('getSeedMaxAmount', () => {
  it('return value set in SEED_MAX_AMOUNT env var', () => {
    process.env.SEED_MAX_AMOUNT = '100';
    const result = getSeedMaxAmount();
    expect(result).toBe(100);
  });

  it('should return default value for non-numberic non-positive input', () => {
    const invalidInputs = [
      'false',
      'true',
      'ANY TEXT',
      '-13',
      '0',
      '',
      undefined,
    ];
    invalidInputs.forEach((input) => {
      process.env.SEED_MAX_AMOUNT = input;
      const result = getSeedMaxAmount();
      expect(result).toBe(10);
    });
  });
});
