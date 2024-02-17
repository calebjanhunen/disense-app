import React, { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Text, TextInput } from 'react-native-paper';

import { Button as CustomBtn, PageView, Spacer } from '@/components';
import { StopwatchContext } from '@/context/stopwatch';
import { TestInfoContext } from '@/context/test-info-context';
import * as ExportDBManager from '@/utils/export-db-files';

const data = [
  { label: 'User 1', value: 1 },
  { label: 'User 2', value: 2 },
  { label: 'User 3', value: 3 },
  { label: 'User 4', value: 4 },
  { label: 'User 5', value: 5 },
];

export default function UserSetup() {
  const { user, setUser, isTestRunning, setIsTestRunning } =
    useContext(TestInfoContext);
  const { startTestStopwatch, stopTestStopwatch, timerDisplay } =
    useContext(StopwatchContext);
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [shoeSize, setShoeSize] = useState<number | undefined>();

  function startTest() {
    // TODO: save user data to db
    // setUser(0);
    setWeight(undefined);
    setHeight(undefined);
    setShoeSize(undefined);
    setIsTestRunning(true);
    startTestStopwatch();
  }

  function stopTest() {
    Alert.alert(
      'Are you sure you want to stop the test?',
      'This will reset the time and stop saving data to the database',
      [
        {
          text: 'No',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsTestRunning(false);
            stopTestStopwatch();
          },
        },
      ]
    );
  }

  async function exportDb() {
    await ExportDBManager.exportDatabaseFilesForUser(user);
  }

  return (
    <PageView>
      <Spacer size='xl' />
      <Text variant='titleLarge'>User Information:</Text>
      <Spacer size='xl' />
      <Dropdown
        valueField='value'
        labelField='label'
        placeholder='Select User'
        data={data}
        onChange={data => setUser(data.value)}
      />
      <Spacer size='xl' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your weight in kg'
        onChangeText={weight => setWeight(parseInt(weight))}
      />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your height in meters'
        onChangeText={height => setHeight(parseFloat(height) * 100)} //convert to cm
      />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your shoe size'
        onChangeText={size => setShoeSize(parseInt(size))}
      />
      <Spacer size='lg' />
      <CustomBtn
        variant='full'
        backgroundColor='secondary'
        textColor='primary'
        onPress={isTestRunning ? stopTest : startTest}
        disabled={
          !isTestRunning && (user === 0 || !weight || !height || !shoeSize)
        }
      >
        {isTestRunning ? 'Stop Test' : 'Start Test'}
      </CustomBtn>
      <Spacer size='xxxl' />
      {isTestRunning && (
        <Text variant='titleLarge' style={{ textAlign: 'center' }}>
          Test running for: {timerDisplay}
        </Text>
      )}
      <Button mode='contained' onPress={exportDb}>
        Export data
      </Button>
    </PageView>
  );
}
