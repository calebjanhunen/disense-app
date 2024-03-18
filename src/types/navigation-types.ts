import { FSR, SPO2Sensor, Thermistor } from '@/interfaces/Sensor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeScreenStackParamList = {
  DeviceConnected: undefined;
  ThermistorInfo: { thermistorData: Thermistor[] };
  FsrInfo: { fsrData: FSR[] };
  Spo2Info: { spo2Data: SPO2Sensor[] };
};

export type DeviceConnectedScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'DeviceConnected'
>;

export type ThermistorInfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'ThermistorInfo'
>;

export type FsrInfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'FsrInfo'
>;

export type Spo2InfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'Spo2Info'
>;
