export function getSeedMaxAmount() {
  let result = 10;
  const { SEED_MAX_AMOUNT } = process.env;

  if (SEED_MAX_AMOUNT) {
    const parsedValue = parseInt(SEED_MAX_AMOUNT);
    const isInvalidInput = isNaN(parsedValue) || parsedValue <= 0;
    if (!isInvalidInput) {
      result = parsedValue;
    }
  }
  return result;
}
