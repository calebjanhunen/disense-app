export interface SPO2Sensor {
  id: number;
  heartRate: number;
  bloodOxygen: number;
}

export interface Thermistor {
  id: number;
  temp: number;
}

export interface FSR {
  id: number;
  force: number;
}

export interface Sensors {
  thermistors: Thermistor[];
  fsr: FSR[];
  spo2: SPO2Sensor[];
}

export interface AnalogSensors {
  thermistors: Thermistor[];
  fsr: FSR[];
}

// export interface Sensors {
//   thermMetatarsal1: Thermistor;
//   thermMetatarsal5: Thermistor;
//   thermHeel: Thermistor;
//   thermBigToe: Thermistor;
//   fsrMetatarsal1: FSR;
//   fsrMetatarsal5: FSR;
//   fsrHeel: FSR;
//   fsrBigToe: FSR;
//   spo2: SPO2Sensor;
// }
