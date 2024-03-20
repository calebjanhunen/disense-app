export function CtoF(tempInC: number): number {
  const fahrenheitVal = (9 / 5) * tempInC + 32;
  const fahrenheitValRoundedTo10thDecimalPlace =
    Math.round(fahrenheitVal * 10) / 10;
  return fahrenheitValRoundedTo10thDecimalPlace;
}
