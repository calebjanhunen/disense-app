import { FSR, SPO2Sensor, Thermistor } from '@/interfaces/Sensor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeScreenStackParamList = {
  DeviceConnected: undefined;
  'Temperature Information': { thermistorData: Thermistor[] };
  'Pressure Information': { fsrData: FSR[] };
  'Blood Oxygen Information': { spo2Data: SPO2Sensor[] };
};

export type DeviceConnectedScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'DeviceConnected'
>;

export type ThermistorInfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'Temperature Information'
>;

export type FsrInfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'Pressure Information'
>;

export type Spo2InfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'Blood Oxygen Information'
>;
