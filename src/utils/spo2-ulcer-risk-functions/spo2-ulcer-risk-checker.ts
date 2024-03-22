import { SPO2Sensor } from '@/interfaces/Sensor';

const threshold = 94;

export function checkSpo2ForUlcerRisk(spo2Data: SPO2Sensor[]): SPO2Sensor[] {
  const atRiskSensors: SPO2Sensor[] = [];
  for (const sensor of spo2Data) {
    if (sensor.bloodOxygen < threshold) {
      atRiskSensors.push(sensor);
    }
  }
  return atRiskSensors;
}
