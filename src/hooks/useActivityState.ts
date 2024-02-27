import { TestInfoContext } from '@/context/test-info-context';
import {
  getActivityStateById,
  insertActivityState,
  updateActivityStateById,
} from '@/db/activity-state-repository';
import { ActivityState } from '@/interfaces/ActivityState';
import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface IUseActivityState {
  getCurrentActivityFromAsyncStorage: () => Promise<void>;
  activityRunning: boolean;
  currentActivityState: ActivityState | null;
  stopCurrentActivityAndStartNewActivity: (
    newActivity: ActivityState
  ) => Promise<void>;
}

export function useActivityState(): IUseActivityState {
  const { user } = useContext(TestInfoContext);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(
    null
  );
  const [activityRunning, setActivityRunning] = useState<boolean>(false);
  const [currentActivityState, setCurrentActivityState] =
    useState<ActivityState | null>(null);

  useEffect(() => {
    getCurrentActivityFromAsyncStorage();
  }, []);

  async function stopCurrentActivityAndStartNewActivity(
    newActivity: ActivityState
  ) {
    if (!user) {
      Alert.alert(
        'No user created',
        'Create a user before starting an activity'
      );
      return;
    }
    if (currentActivityState === newActivity) {
      handleError(
        'Please select another activity',
        new Error('Cannot select currently active activity state')
      );
      return;
    }

    try {
      await endActivity();
    } catch (e) {
      handleError('Could not end activity.', e);
      return;
    }

    try {
      await startActivity(newActivity);
    } catch (e) {
      handleError(`Could not start activity: ${newActivity}`, e);
    }
  }

  async function startActivity(activity: ActivityState): Promise<void> {
    if (!user) {
      Alert.alert(
        'No user created',
        'Create a user before starting an activity'
      );
      return;
    }
    const insertedId = await insertActivityState(activity, user);
    await saveCurrentActivityToAsyncStorage(insertedId);
    setCurrentActivityId(insertedId);
    setActivityRunning(true);
    setCurrentActivityState(activity);
  }

  async function endActivity(): Promise<void> {
    if (!currentActivityId) {
      return;
    }
    await updateActivityStateById(currentActivityId, user);
    await AsyncStorage.removeItem('current_activity');
    setActivityRunning(false);
    setCurrentActivityId(null);
    setCurrentActivityState(null);
  }

  async function saveCurrentActivityToAsyncStorage(
    insertedId: number
  ): Promise<void> {
    try {
      await AsyncStorage.setItem('current_activity', insertedId.toString());
    } catch (e) {
      handleError('Could not save current activity.', e);
    }
  }

  async function getCurrentActivityFromAsyncStorage(): Promise<void> {
    try {
      const currentActivityId = await AsyncStorage.getItem('current_activity');
      if (currentActivityId) {
        const result = await getActivityStateById(
          parseInt(currentActivityId),
          user
        );
        if (!result) {
          await AsyncStorage.removeItem('current_activity');
          setActivityRunning(false);
          setCurrentActivityId(null);
        } else {
          setCurrentActivityId(parseInt(currentActivityId));
          setActivityRunning(true);
          setCurrentActivityState(result.activityState);
        }
      }
    } catch (e) {
      handleError('Could not get current activity.', e);
    }
  }

  return {
    stopCurrentActivityAndStartNewActivity,
    getCurrentActivityFromAsyncStorage,
    activityRunning,
    currentActivityState,
  };
}
