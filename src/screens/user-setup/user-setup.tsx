import React, { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';

import { Button as CustomBtn, PageView, Spacer } from '@/components';
import { useUserData } from '@/hooks/useUserData';
import { TestInfoContext } from '@/context/test-info-context';
import { Dropdown } from 'react-native-element-dropdown';

export default function UserSetup() {
  const { user, setUser } = useContext(TestInfoContext);
  const { saveUser, isSaving, getAllUsers } = useUserData();
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [shoeSize, setShoeSize] = useState<string>('');
  const [dropdownData, setDropdownData] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const users = await getAllUsers();
    setDropdownData(prev => {
      return users.map(user => {
        return { label: `User ${user.id}`, value: user.id?.toString() };
      });
    });
  }

  async function saveUserToDb() {
    if (!weight || !height || !shoeSize) {
      Alert.alert('Missing values');
      return;
    }
    await saveUser({
      weight: parseInt(weight),
      height: parseInt(height),
      shoeSize: parseInt(shoeSize),
    });
    setWeight('');
    setHeight('');
    setShoeSize('');
  }

  return (
    <PageView>
      <Spacer size='xl' />
      <Text variant='titleLarge'>User Information:</Text>
      <Spacer size='xl' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your weight in kg'
        onChangeText={weight => setWeight(weight)}
        value={weight}
      />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your height in centimeters'
        onChangeText={height => setHeight(height)}
        value={height}
      />
      <Spacer size='lg' />
      <TextInput
        keyboardType='number-pad'
        label='Enter your shoe size'
        onChangeText={size => setShoeSize(size)}
        value={shoeSize}
      />
      <Spacer size='lg' />
      <CustomBtn
        variant='full'
        backgroundColor='secondary'
        textColor='primary'
        onPress={saveUserToDb}
        disabled={!weight || !height || !shoeSize || isSaving || user !== 0}
      >
        {isSaving ? (
          <ActivityIndicator size='large' color='white' />
        ) : (
          'Save User'
        )}
      </CustomBtn>
      <Spacer size='xxxs' />
      {user !== 0 && (
        <Text style={{ textAlign: 'center', color: 'red' }}>
          Finish current test before creating another user.
        </Text>
      )}

      <Spacer size='xxxl' />
      <Text variant='headlineMedium' style={{ textAlign: 'center' }}>
        Or select a created user
      </Text>
      <Dropdown
        style={{ borderColor: 'black', borderWidth: 1 }}
        data={dropdownData}
        labelField='label'
        valueField='value'
        onChange={item => setUser(parseInt(item.value))}
      />
    </PageView>
  );
}
