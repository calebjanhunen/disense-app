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
