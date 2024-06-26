import React, { useState } from 'react';
import { Image, LayoutChangeEvent, View } from 'react-native';

import { PageView, Spacer } from '@/components';
import { Text } from 'react-native-paper';
import { useSensorData } from '@/context/sensor-context/sensor-context';

const lineColor = 'grey';

export default function FsrInfo(): React.ReactElement {
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
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        <Image
          source={require('../../images/foot.png')}
          resizeMode='contain'
          style={{
            width: '60%',
            height: '80%',
          }}
          onLayout={onImageLayout}
        />
        {/* Big Toe */}
        <View
          style={{
            height: 2,
            width: 100,
            left: imgSize.width * 0.86,
            top: imgSize.height * 0.13,
            backgroundColor: lineColor,
            position: 'absolute',
          }}
        ></View>
        <Text
          variant='titleLarge'
          style={{
            position: 'absolute',
            left: imgSize.width * 0.86 + 100 + 10,
            top: imgSize.height * 0.13 - 14,
          }}
        >
          {sensorData.fsr[3]?.force}N
        </Text>

        {/* 1st Metatarsal */}
        <View
          style={{
            height: 2,
            width: 133,
            left: imgSize.width * 0.7,
            top: imgSize.height * 0.36,
            backgroundColor: lineColor,
            position: 'absolute',
          }}
        ></View>
        <Text
          variant='titleLarge'
          style={{
            position: 'absolute',
            left: imgSize.width * 0.7 + 133 + 10,
            top: imgSize.height * 0.36 - 14,
          }}
        >
          {sensorData.fsr[0]?.force}N
        </Text>

        {/* 5th Metatarsal */}
        <View
          style={{
            height: 60,
            width: 244,
            left: imgSize.width * 0.2,
            top: imgSize.height * 0.36,
            borderWidth: 2,
            borderBottomColor: lineColor,
            borderLeftColor: lineColor,
            borderRightColor: 'transparent',
            borderTopColor: 'transparent',
            position: 'absolute',
          }}
        ></View>
        <Text
          variant='titleLarge'
          style={{
            position: 'absolute',
            left: imgSize.width * 0.2 + 244 + 10,
            top: imgSize.height * 0.36 + 45,
          }}
        >
          {sensorData.fsr[1]?.force}N
        </Text>

        {/* Heel */}
        <View
          style={{
            height: 2,
            width: 180,
            left: imgSize.width * 0.45,
            top: imgSize.height * 0.8,
            backgroundColor: lineColor,
            position: 'absolute',
          }}
        ></View>
        <Text
          variant='titleLarge'
          style={{
            position: 'absolute',
            left: imgSize.width * 0.45 + 180 + 10,
            top: imgSize.height * 0.8 - 14,
          }}
        >
          {sensorData.fsr[2]?.force}N
        </Text>
      </View>
      <Spacer size='lg' />
    </PageView>
  );
}
