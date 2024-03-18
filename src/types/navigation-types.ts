import { Thermistor } from '@/interfaces/Sensor';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeScreenStackParamList = {
  DeviceConnected: undefined;
  ThermistorInfo: { thermistorData: Thermistor[] };
  FsrInfo: undefined;
  Spo2info: undefined;
};

export type DeviceConnectedScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'DeviceConnected'
>;

export type ThermistorInfoScreenProps = NativeStackScreenProps<
  HomeScreenStackParamList,
  'ThermistorInfo'
>;
