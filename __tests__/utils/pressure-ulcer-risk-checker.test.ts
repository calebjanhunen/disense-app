import { FSR } from '@/interfaces/Sensor';
import * as forceToPressureCalculation from '@/utils/pressure-ulcer-risk-functions/force-to-pressure';
import { checkPressureForUlcerRisk } from '@/utils/pressure-ulcer-risk-functions/pressure-ulcer-risk-checker';

describe('checkPressureForUlcerRisk function', () => {
  test('should return false if average pressure is below threshold', () => {
    const fsrData: FSR[] = [
      { id: 1, force: 800 },
      { id: 2, force: 820 },
      { id: 3, force: 910 },
      { id: 4, force: 739 },
    ];
    const shoeSize = 5;

    jest
      .spyOn(forceToPressureCalculation, 'forceToPressureInKiloPascals')
      .mockReturnValue(140);

    const result = checkPressureForUlcerRisk(fsrData, shoeSize);

    expect(result).toBe(false);
  });
  test('should return false if average pressure is equal to threshold', () => {
    const fsrData: FSR[] = [
      { id: 1, force: 800 },
      { id: 2, force: 820 },
      { id: 3, force: 910 },
      { id: 4, force: 739 },
    ];
    const shoeSize = 5;

    jest
      .spyOn(forceToPressureCalculation, 'forceToPressureInKiloPascals')
      .mockReturnValue(143.6);

    const result = checkPressureForUlcerRisk(fsrData, shoeSize);

    expect(result).toBe(false);
  });
  test('should return true if average pressure is greater than threshold', () => {
    const fsrData: FSR[] = [
      { id: 1, force: 800 },
      { id: 2, force: 820 },
      { id: 3, force: 910 },
      { id: 4, force: 739 },
    ];
    const shoeSize = 5;

    jest
      .spyOn(forceToPressureCalculation, 'forceToPressureInKiloPascals')
      .mockReturnValue(150);

    const result = checkPressureForUlcerRisk(fsrData, shoeSize);

    expect(result).toBe(true);
  });
});
