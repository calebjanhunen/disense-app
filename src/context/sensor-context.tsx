import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { FSR, SPO2Sensor, Thermistor } from '../interfaces/Sensor';
import { TestInfoContext } from './test-info-context';

interface ISensorContext {
  thermistorData: Thermistor[];
  setThermistorData: Dispatch<SetStateAction<Thermistor[]>>;
  fsrData: FSR[];
  setFsrData: Dispatch<SetStateAction<FSR[]>>;
  spo2Data: SPO2Sensor[];
  setSpo2Data: Dispatch<SetStateAction<SPO2Sensor[]>>;
}

interface Props {
  children: React.ReactNode;
}

const SensorContext = createContext<ISensorContext>({} as ISensorContext);

export const useSensorData = () => useContext(SensorContext);

export function SensorContextProvider({ children }: Props) {
  const [thermistorData, setThermistorData] = useState<Thermistor[]>([]);
  const [fsrData, setFsrData] = useState<FSR[]>([]);
  const [spo2Data, setSpo2Data] = useState<SPO2Sensor[]>([]);
  //   const { user } = useContext(TestInfoContext);

  return (
    <SensorContext.Provider
      value={{
        thermistorData,
        setThermistorData,
        fsrData,
        setFsrData,
        spo2Data,
        setSpo2Data,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}
