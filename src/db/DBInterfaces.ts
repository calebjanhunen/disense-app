import { ActivityState } from '@/interfaces/ActivityState';
import { Location } from '@/interfaces/Location';

export interface ThermistorDB {
  id: number;
  sensorId: number;
  createdAt: Date;
  temp: number;
}

export interface FsrDB {
  id: number;
  sensorId: number;
  createdAt: Date;
  force: number;
}

export interface Spo2DB {
  id: number;
  sensorId: number;
  createdAt: Date;
  bloodOxygen: number;
}

export interface SensorDB {
  id: number;
  sensorId: number;
  createdAt: Date;
  value: number;
}

export interface ActivityStateDB {
  id: number;
  activityState: ActivityState;
  timeStarted: Date;
  timeEnded: Date | null;
  user: number;
}

export interface LocationDB {
  id: number;
  location: Location;
  timeStarted: Date;
  timeEnded: Date | null;
  user: number;
}
