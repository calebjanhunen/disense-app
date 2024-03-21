import { FSR } from '@/interfaces/Sensor';
import { forceToPressureInKiloPascals } from '@/utils/pressure-calculations/force-to-pressure';
import * as shoeSizeToArea from '@/utils/pressure-calculations/shoe-size-to-area';

describe('forceToPressureInKiloPascals function', () => {
  test('should convert force to pressure successfully', () => {
    const fsrData: FSR[] = [
      { id: 1, force: 800 },
      { id: 2, force: 820 },
      { id: 3, force: 910 },
      { id: 4, force: 739 },
    ];
    const shoeSize = 8;
    jest
      .spyOn(shoeSizeToArea, 'shoeSizeToAreaInMeters')
      .mockReturnValue(0.0069984);

    const result = forceToPressureInKiloPascals(fsrData, shoeSize);

    expect(result).toEqual(116.78);
  });
});
