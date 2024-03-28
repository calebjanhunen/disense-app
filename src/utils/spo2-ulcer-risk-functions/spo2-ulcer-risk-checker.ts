import { SPO2Sensor } from '@/interfaces/Sensor';

const threshold = 94;

export function checkSpo2ForUlcerRisk(spo2Data: SPO2Sensor[]): boolean {
  for (const sensor of spo2Data) {
    if (sensor.bloodOxygen < threshold) {
      return true;
    }
  }
  return false;
}
