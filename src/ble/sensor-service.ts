import { MyBleManager } from './ble-manager';

export class SensorService {
  private bleManager: MyBleManager;

  constructor(bleManager: MyBleManager) {
    this.bleManager = bleManager;
  }
}
