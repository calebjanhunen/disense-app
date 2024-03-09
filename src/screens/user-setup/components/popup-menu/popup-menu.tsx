import IonIcons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Modal, Portal, Text } from 'react-native-paper';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

interface Props {
  users: { label: string; value: string }[];
}

export default function PopupMenu({ users }: Props) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <Portal>
        <Modal
          visible={modalVisible}
          dismissableBackButton={true}
          onDismiss={() => setModalVisible(false)}
          style={{ alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text variant='headlineSmall'>
              Select User to delete their data
            </Text>
            <Dropdown
              style={{ borderColor: 'black', borderWidth: 1 }}
              data={users}
              labelField='label'
              valueField='value'
              onChange={() => {}}
            />
          </View>
        </Modal>
      </Portal>
      <Menu>
        <MenuTrigger>
          <IonIcons name='ellipsis-vertical' size={24} />
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{
            borderRadius: 10,
            backgroundColor: 'lightgrey',
            padding: 3,
            alignItems: 'center',
            width: 180,
          }}
        >
          <MenuOption
            onSelect={() => setModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <IonIcons name='trash' size={24} color='red' />
            <Text variant='bodyLarge' style={{ color: 'red' }}>
              Delete User Data
            </Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </>
  );
}
