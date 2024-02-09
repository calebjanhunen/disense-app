import React from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Text, TextInput } from 'react-native-paper';
import { Button, PageView, Spacer } from '../../components';

const data = [
  { label: 'User 1', value: 1 },
  { label: 'User 2', value: 2 },
  { label: 'User 3', value: 3 },
  { label: 'User 4', value: 4 },
  { label: 'User 5', value: 5 },
];

export default function UserSetup() {
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
        onChange={() => {}}
      />
      <Spacer size='xl' />
      <TextInput keyboardType='number-pad' label='Enter your weight in kg' />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your height in meters'
      />
      <Spacer size='lg' />
      <TextInput keyboardType='number-pad' label='Enter your shoe size' />
      <Spacer size='lg' />
      <Button
        variant='full'
        backgroundColor='secondary'
        textColor='primary'
        onPress={() => {}}
      >
        Start Test
      </Button>
    </PageView>
  );
}
