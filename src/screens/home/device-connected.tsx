import React, { useState } from 'react';
import { ImageBackground, LayoutChangeEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { PageView, Spacer } from '../../components';
import { useSensorData } from '../../context/sensor-context/sensor-context';
import CircleFsr from './components/circle-fsr/circle-fsr';
import ConnectedDeviceHeader from './components/connected-device-header/connected-device-header';
import SquareFsr from './components/square-fsr/square-fsr';
import Thermistor from './components/thermistor/thermistor';

export default function DeviceConnected(): React.ReactElement {
  const { sensorData } = useSensorData();
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  function onImageLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setImgSize({ width, height });
  }

  return (
    <PageView>
      <ConnectedDeviceHeader />
      <Spacer size='lg' />
      <Text>SPO2:</Text>
      <Text>Heart Rate: {sensorData.spo2[0]?.heartRate} bpm</Text>
      <Text>Blood oxygen: {sensorData.spo2[0]?.bloodOxygen}%</Text>
      <ImageBackground
        source={require('../../images/foot.png')}
        resizeMode='contain'
        style={{
          flex: 1,
        }}
        onLayout={onImageLayout}
      >
        {/*Heel*/}
        <SquareFsr
          height={imgSize.height * 0.14}
          width={imgSize.height * 0.14}
          top={imgSize.height * 0.83}
          left={imgSize.width * 0.45}
          sensor={sensorData.fsr[2]}
        />
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.16}
          top={imgSize.height * 0.91}
          left={imgSize.width * 0.33}
          sensor={sensorData.thermistors[2]}
        />

        {/* 1st Metatarsal */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.28}
          left={imgSize.width * 0.64}
          sensor={sensorData.fsr[0]}
        />
        {/* 379.4285 */}
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.11}
          top={imgSize.height * 0.34}
          left={imgSize.width * 0.55}
          sensor={sensorData.thermistors[0]}
        />

        {/* 5th Metatarsal */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.28}
          left={imgSize.width * 0.33}
          sensor={sensorData.fsr[1]}
        />
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.11}
          top={imgSize.height * 0.34}
          left={imgSize.width * 0.24}
          sensor={sensorData.thermistors[1]}
        />

        {/* Big Toe */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.09}
          left={imgSize.width * 0.76}
          sensor={sensorData.fsr[3]}
        />
        <Thermistor
          height={imgSize.height * 0.04}
          width={imgSize.height * 0.08}
          top={imgSize.height * 0.14}
          left={imgSize.width * 0.7}
          sensor={sensorData.thermistors[3]}
        />
      </ImageBackground>

      <Spacer size='lg' />
    </PageView>
  );
}
