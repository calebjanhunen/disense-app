export function shoeSizeToAreaInMeters(shoeSize: number): number {
  // console.log('here');
  const length = shoeSizeToLengthTable[shoeSize];
  const width = length * 0.15; // rough estimate: foot width = 15% of foot length
  const area = (length * width) / 10000;
  return parseFloat(area.toFixed(7));
}

type Table = {
  [key: number]: number;
};
// key: shoe size, value: length(cm)
const shoeSizeToLengthTable: Table = {
  5: 21.6,
  5.5: 22.2,
  6: 22.5,
  6.5: 23,
  7: 23.5,
  7.5: 23.8,
  8: 24.1,
  8.5: 24.6,
  9: 25.1,
  9.5: 25.4,
  10: 25.9,
  10.5: 26.2,
  11: 26.7,
  11.5: 27.1,
  12: 27.6,
};
