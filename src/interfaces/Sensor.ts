import { SensorType } from '../types/sensor-types';

export interface Sensor {
  id: number;
  value: number;
}

export interface Sensors {
  type: SensorType;
  sensors: Sensor[];
}
