import { FSR } from '@/interfaces/Sensor';
import { shoeSizeToAreaInMeters } from './shoe-size-to-area';

export function forceToPressureInKiloPascals(
  fsrData: FSR[],
  shoeSize: number
  // shoeSizeToAreaInMeters: (shoeSize: number) => number
): number {
  let avgForce: number = 0;
  for (const fsr of fsrData) {
    avgForce += fsr.force;
  }
  avgForce /= fsrData.length;

  const footArea = shoeSizeToAreaInMeters(shoeSize);
  const pressureInPascals = avgForce / footArea;

  return Math.round((pressureInPascals / 1000) * 100) / 100;
}
