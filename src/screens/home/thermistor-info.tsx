import React, { useState } from 'react';
import { ImageBackground, LayoutChangeEvent } from 'react-native';

import { PageView, Spacer } from '@/components';
import { ThermistorInfoScreenProps } from '@/types/navigation-types';
import Thermistor from './components/thermistor/thermistor';

export default function ThermistorInfo({
  route,
}: ThermistorInfoScreenProps): React.ReactElement {
  const { thermistorData } = route.params;
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
      <Spacer size='lg' />
      <ImageBackground
        source={require('../../images/foot.png')}
        resizeMode='contain'
        style={{
          flex: 1,
        }}
        onLayout={onImageLayout}
      >
        {/*Heel*/}
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.16}
          top={imgSize.height * 0.91}
          left={imgSize.width * 0.33}
          sensor={thermistorData[2]}
        />

        {/* 1st Metatarsal */}
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.11}
          top={imgSize.height * 0.34}
          left={imgSize.width * 0.55}
          sensor={thermistorData[0]}
        />

        {/* 5th Metatarsal */}
        <Thermistor
          height={imgSize.height * 0.05}
          width={imgSize.height * 0.11}
          top={imgSize.height * 0.34}
          left={imgSize.width * 0.24}
          sensor={thermistorData[1]}
        />

        {/* Big Toe */}
        <Thermistor
          height={imgSize.height * 0.04}
          width={imgSize.height * 0.08}
          top={imgSize.height * 0.14}
          left={imgSize.width * 0.7}
          sensor={thermistorData[3]}
        />
      </ImageBackground>

      <Spacer size='lg' />
    </PageView>
  );
}
