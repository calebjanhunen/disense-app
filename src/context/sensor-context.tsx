import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FSR, SPO2Sensor, Sensors, Thermistor } from '../interfaces/Sensor';
import { TestInfoContext } from './test-info-context';

interface ISensorContext {
  sensorData: Sensors;
  setSensorData: Dispatch<SetStateAction<Sensors>>;
}

interface Props {
  children: React.ReactNode;
}

const SensorContext = createContext<ISensorContext>({} as ISensorContext);

export const useSensorData = () => useContext(SensorContext);

export function SensorContextProvider({ children }: Props) {
  const [sensorData, setSensorData] = useState<Sensors>({
    thermistors: [],
    spo2: [],
    fsr: [],
  });
  const { user, isTestRunning } = useContext(TestInfoContext);
  useEffect(() => {
    // console.log('sensor data rerendered');
  }, [sensorData]);

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        setSensorData,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
}
