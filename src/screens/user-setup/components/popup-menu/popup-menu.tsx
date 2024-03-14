import { exportAllUsers } from '@/utils/export-db-files';
import IonIcons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Text } from 'react-native-paper';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

export default function PopupMenu() {
  return (
    <>
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
            onSelect={async () => {
              await exportAllUsers();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <IonIcons name='share-outline' size={24} color='black' />
            <Text variant='bodyLarge' style={{ color: 'black' }}>
              Export All Users
            </Text>
          </MenuOption>
          <MenuOption
            onSelect={() => {}}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
            disabled={true}
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
