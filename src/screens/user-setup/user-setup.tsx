import React, { useContext, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Text, TextInput } from 'react-native-paper';
import { Button, PageView, Spacer } from '../../components';
import { UserContext } from '../../context/user-context';

const data = [
  { label: 'User 1', value: 1 },
  { label: 'User 2', value: 2 },
  { label: 'User 3', value: 3 },
  { label: 'User 4', value: 4 },
  { label: 'User 5', value: 5 },
];

export default function UserSetup() {
  // const [user, setUser] = useState<number>();
  const { user, setUser } = useContext(UserContext);
  const [weight, setWeight] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [shoeSize, setShoeSize] = useState<number>();

  function submitUserInfo() {
    console.log('user: ', user);
    console.log('weight: ', weight);
    console.log('height: ', height);
    console.log('shoeSize: ', shoeSize);
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
        onChangeText={height => setHeight(parseInt(parseFloat(height) * 100))} //convert to cm
      />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your shoe size'
        onChangeText={size => setShoeSize(parseInt(size))}
      />
      <Spacer size='lg' />
      <Button
        variant='full'
        backgroundColor='secondary'
        textColor='primary'
        onPress={submitUserInfo}
      >
        Start Test
      </Button>
    </PageView>
  );
}
