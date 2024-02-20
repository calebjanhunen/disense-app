import { View } from 'react-native';
import React, { useContext } from 'react';

import { PageView, Spacer } from '@/components';
import { Button, Text } from 'react-native-paper';
import { TestInfoContext } from '@/context/test-info-context';
import { useStopwatch } from '@/hooks/useStopwatch';

export default function TestPage() {
  const { isTestRunning, setIsTestRunning } = useContext(TestInfoContext);
  const { startStopwatch, timeDisplay, stopStopwatch } = useStopwatch();

  function startTest() {
    startStopwatch();
    setIsTestRunning(true);
  }

  function stopTest() {
    stopStopwatch();
    setIsTestRunning(false);
  }

  return (
    <PageView>
      <View style={{ alignItems: 'center' }}>
        <Text variant='displaySmall'>{timeDisplay}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Button mode='contained' onPress={isTestRunning ? stopTest : startTest}>
          {isTestRunning ? 'Stop Test' : 'Start Test'}
        </Button>
      </View>
      <Spacer size='lg' />
    </PageView>
  );
}
