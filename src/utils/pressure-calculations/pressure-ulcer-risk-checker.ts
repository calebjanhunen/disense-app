import { FSR } from '@/interfaces/Sensor';
import { forceToPressureInKiloPascals } from './force-to-pressure';

const pressureThreshold = 143.6; // In kPa

export function checkPressureForUlcerRisk(
  fsrData: FSR[],
  shoeSize: number
): boolean {
  const avgPressure = forceToPressureInKiloPascals(fsrData, shoeSize);
  if (avgPressure > pressureThreshold) {
    return true;
  }
  return false;
}
