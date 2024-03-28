import { SPO2Sensor } from '@/interfaces/Sensor';
import { checkSpo2ForUlcerRisk } from '@/utils/spo2-ulcer-risk-functions/spo2-ulcer-risk-checker';

describe('checkSpo2ForUlcerRisk function', () => {
  test('should return array of size 1 if 1 sensor is below threshold', () => {
    const spo2Data: SPO2Sensor[] = [{ id: 1, heartRate: 70, bloodOxygen: 93 }];

    const result = checkSpo2ForUlcerRisk(spo2Data);

    expect(result).toStrictEqual(true);
  });
  test('should return array of size 0 if the sensor is equal to the threshold', () => {
    const spo2Data: SPO2Sensor[] = [{ id: 1, heartRate: 70, bloodOxygen: 94 }];

    const result = checkSpo2ForUlcerRisk(spo2Data);

    expect(result).toStrictEqual(false);
  });
  test('should return array of size 0 if the sensor is greater than the threshold', () => {
    const spo2Data: SPO2Sensor[] = [{ id: 1, heartRate: 70, bloodOxygen: 99 }];

    const result = checkSpo2ForUlcerRisk(spo2Data);

    expect(result).toStrictEqual(false);
  });
});
