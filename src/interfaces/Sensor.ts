import { SensorType } from '../types/sensor-types';

export interface Sensor {
  id: number;
  temp: number;
}

export interface Sensors {
  type: SensorType;
  sensors: Sensor[];
}
