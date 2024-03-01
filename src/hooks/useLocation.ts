import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  getLocationById,
  insertLocation,
  updateLocationById,
} from '@/db/location-repository';
import { TestInfoContext } from '@/context/test-info-context';
import { handleError } from '@/utils/error-handler';
import { Location } from '@/interfaces/Location';

interface IUseLocation {
  currentLocation: Location | null;
  stopCurrentLocationAndStartNewLocation: (
    newLocation: Location
  ) => Promise<void>;
  endLocation: () => Promise<void>;
}

export function useLocation(): IUseLocation {
  const { user } = useContext(TestInfoContext);
  const [currentLocationId, setCurrentLocationId] = useState<number | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    getCurrentLocationFromAsyncStorage();
  }, []);

  async function stopCurrentLocationAndStartNewLocation(newLocation: Location) {
    if (!user) {
      Alert.alert(
        'No user created',
        'Create a user before choosing a location'
      );
      return;
    }
    if (currentLocation === newLocation) {
      handleError(
        'Please select another location',
        new Error('Cannot select current location')
      );
      return;
    }

    try {
      await endLocation();
    } catch (e) {
      handleError('Could not end current location.', e);
      return;
    }

    try {
      await startActivity(newLocation);
    } catch (e) {
      handleError(`Could not start location: ${newLocation}`, e);
    }
  }

  async function startActivity(location: Location): Promise<void> {
    if (!user) {
      Alert.alert(
        'No user created',
        'Create a user before starting a location'
      );
      return;
    }
    const insertedId = await insertLocation(location, user);
    await saveCurrentLocationToAsyncStorage(insertedId);
    setCurrentLocationId(insertedId);
    setCurrentLocation(location);
  }

  async function endLocation(): Promise<void> {
    if (!currentLocationId) {
      return;
    }
    await updateLocationById(currentLocationId, user);
    await AsyncStorage.removeItem('current_location');
    setCurrentLocationId(null);
    setCurrentLocation(null);
  }

  async function saveCurrentLocationToAsyncStorage(
    insertedId: number
  ): Promise<void> {
    try {
      await AsyncStorage.setItem('current_location', insertedId.toString());
    } catch (e) {
      handleError('Could not save current location.', e);
    }
  }

  async function getCurrentLocationFromAsyncStorage(): Promise<void> {
    try {
      const currentLocationId = await AsyncStorage.getItem('current_location');
      if (currentLocationId) {
        const result = await getLocationById(parseInt(currentLocationId), user);
        if (!result) {
          await AsyncStorage.removeItem('current_location');
          setCurrentLocationId(null);
        } else {
          setCurrentLocationId(parseInt(currentLocationId));
          setCurrentLocation(result.location);
        }
      }
    } catch (e) {
      handleError('Could not get current location.', e);
    }
  }

  return {
    stopCurrentLocationAndStartNewLocation,
    currentLocation,
    endLocation,
  };
}
