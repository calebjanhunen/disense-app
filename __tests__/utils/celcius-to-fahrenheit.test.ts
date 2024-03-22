import { CtoF } from '@/utils/celsius-to-fahrenheit';

describe('Test CtoF function', () => {
  test('CtoF returns correct fahrenheit value', () => {
    const cTemp1 = 26.8;
    const result1 = CtoF(cTemp1);

    // Ensure rounding is correct
    const cTemp2 = 30.2;
    const result2 = CtoF(cTemp2);

    expect(result1).toBe(80.2);
    expect(result2).toBe(86.4);
  });
});
