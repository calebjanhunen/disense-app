// export { render } from '@testing-library/react-native';
// import { FSR, SPO2Sensor, Thermistor } from '@/interfaces/Sensor';
// import { render } from '@testing-library/react-native';
// import React from 'react';
// import { Button, Text } from 'react-native';
// import { SensorContextProvider, useSensorData } from './sensor-context';

// const testThermistorData: Thermistor[] = [
//   { id: 1, temp: 26.7 },
//   { id: 2, temp: 26.4 },
//   { id: 3, temp: 26.6 },
//   { id: 4, temp: 26.1 },
// ];

// const testFsrData: FSR[] = [
//   { id: 1, force: 400 },
//   { id: 2, force: 410 },
//   { id: 3, force: 404 },
//   { id: 4, force: 500 },
// ];

// const testSpo2Data: SPO2Sensor[] = [{ id: 1, heartRate: 70, bloodOxygen: 99 }];

// // function TestComponent() {
// //   const { sensorData, updateSensorData } = useSensorData();

// //   return (
// //     <>
// //       <Text>sensorData: {JSON.stringify(sensorData)}</Text>
// //       <Button
// //         onPress={() =>
// //           updateSensorData(testThermistorData, testFsrData, testSpo2Data)
// //         }
// //         title='Press'
// //       />
// //     </>
// //   );
// // }

// describe('test SensorContext', () => {
//   it('provides the initial sensor state', () => {
//     const screen = render(

//     );

//     screen.getByText('this shoudl fail');
//   });
// });
