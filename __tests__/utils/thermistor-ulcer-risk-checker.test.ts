import { Thermistor } from '@/interfaces/Sensor';
import { checkThermistorsForUlcerRisk } from '@/utils/thermistor-ulcer-risk-checker';

describe('checkThermistorsForUlcerRisk function', () => {
  test('identifies at risk sensors correctly', () => {
    const thermistorData: Thermistor[] = [
      { id: 1, temp: 36.7 },
      { id: 2, temp: 33.9 },
      { id: 3, temp: 37.2 },
      { id: 4, temp: 37.2 },
    ];
    const result = checkThermistorsForUlcerRisk(thermistorData);
    expect(result).toStrictEqual([{ id: 1, temp: 36.7 }]);
  });
});
