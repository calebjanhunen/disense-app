import { Thermistor } from '@/interfaces/Sensor';
import { checkThermistorsForUlcerRisk } from '@/utils/thermistor-ulcer-risk-checker';

describe('checkThermistorsForUlcerRisk function', () => {
  test('result should contain 1 thermistor if it is > 4 degrees higher than the other 3 thermistors', () => {
    const thermistorData: Thermistor[] = [
      { id: 1, temp: 36.7 },
      { id: 2, temp: 33.9 },
      { id: 3, temp: 33.9 },
      { id: 4, temp: 33.9 },
    ];
    const result = checkThermistorsForUlcerRisk(thermistorData);
    expect(result).toStrictEqual([{ id: 1, temp: 36.7 }]);
  });
  test('result should be empty if there is still 1 thermistor <= 4 degrees from the at risk thermistor', () => {
    const thermistorData: Thermistor[] = [
      { id: 1, temp: 36.7 },
      { id: 2, temp: 35.0 },
      { id: 3, temp: 33.9 },
      { id: 4, temp: 33.9 },
    ];
    const result = checkThermistorsForUlcerRisk(thermistorData);
    expect(result).toStrictEqual([]);
  });
});
