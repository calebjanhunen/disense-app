import { Thermistor } from '@/interfaces/Sensor';
import { CtoF } from '../celsius-to-fahrenheit';

//temperature difference in fahrenheit
const thresholdVal = 4;

export function checkThermistorsForUlcerRisk(
  thermistorData: Thermistor[]
): Thermistor[] {
  const atRiskThermistors: Thermistor[] = [];
  for (let i = 0; i < thermistorData.length; i++) {
    let count = 0; // num of thermistors
    for (let j = 0; j < thermistorData.length; j++) {
      const therm1F = CtoF(thermistorData[i].temp);
      const therm2F = CtoF(thermistorData[j].temp);

      if (i !== j) {
        if (
          therm1F - therm2F > thresholdVal &&
          !atRiskThermistors.includes(thermistorData[i])
        ) {
          count++;
        }
      }
    }

    // Only pushes to atRiskThermistors if there is 1 thermistor higher than the other 3
    if (count === 3) {
      atRiskThermistors.push(thermistorData[i]);
    }
  }

  return atRiskThermistors;
}

// Scenario: Multiple thermistors are 4 degrees greater than a thermistor, are all of those thermistors at risk?
