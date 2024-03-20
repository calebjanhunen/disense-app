import React, { useState } from 'react';
import { ImageBackground, LayoutChangeEvent } from 'react-native';

import { PageView, Spacer } from '@/components';
import { FsrInfoScreenProps } from '@/types/navigation-types';
import CircleFsr from './components/circle-fsr/circle-fsr';
import SquareFsr from './components/square-fsr/square-fsr';

export default function FsrInfo({
  route,
}: FsrInfoScreenProps): React.ReactElement {
  const { fsrData } = route.params;
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
        <SquareFsr
          height={imgSize.height * 0.14}
          width={imgSize.height * 0.14}
          top={imgSize.height * 0.83}
          left={imgSize.width * 0.45}
          sensor={fsrData[2]}
        />

        {/* 1st Metatarsal */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.28}
          left={imgSize.width * 0.64}
          sensor={fsrData[0]}
        />

        {/* 5th Metatarsal */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.28}
          left={imgSize.width * 0.33}
          sensor={fsrData[1]}
        />

        {/* Big Toe */}
        <CircleFsr
          height={imgSize.height * 0.098}
          width={imgSize.height * 0.098}
          top={imgSize.height * 0.09}
          left={imgSize.width * 0.76}
          sensor={fsrData[3]}
        />
      </ImageBackground>

      <Spacer size='lg' />
    </PageView>
  );
}
