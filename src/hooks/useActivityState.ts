import { TestInfoContext } from '@/context/test-info-context';
import {
  getActivityStateById,
  insertActivityState,
  updateActivityStateById,
} from '@/db/activity-state-repository';
import { ActivityState } from '@/interfaces/ActivityState';
import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';

interface IUseActivityState {
  startActivity(activity: ActivityState): Promise<void>;
  endActivity(): Promise<void>;
  getCurrentActivity: () => Promise<void>;
  activityRunning: boolean;
  currentActivityLabel: ActivityState | null;
}

export function useActivityState(): IUseActivityState {
  const { user } = useContext(TestInfoContext);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(
    null
  );
  const [activityRunning, setActivityRunning] = useState<boolean>(false);
  const [currentActivityLabel, setCurrentActivityLabel] =
    useState<ActivityState | null>(null);

  async function startActivity(activity: ActivityState): Promise<void> {
    if (!user) {
      Alert.alert(
        'No user created',
        'Create a user before starting an activity'
      );
      return;
    }
    try {
      const insertedId = await insertActivityState(activity, user);
      await saveCurrentActivity(insertedId);
      setCurrentActivityId(insertedId);
      setActivityRunning(true);
      setCurrentActivityLabel(activity);
    } catch (e) {
      handleError(`Could not start activity: ${activity}`, e);
    }
  }

  async function endActivity(): Promise<void> {
    if (!currentActivityId) {
      console.log('no current activity');
      return;
    }
    try {
      await updateActivityStateById(currentActivityId, user);
      await AsyncStorage.removeItem('current_activity');
      setActivityRunning(false);
      setCurrentActivityId(null);
      setCurrentActivityLabel(null);
    } catch (e) {
      handleError('Could not end activity.', e);
    }
  }

  async function saveCurrentActivity(insertedId: number): Promise<void> {
    try {
      await AsyncStorage.setItem('current_activity', insertedId.toString());
    } catch (e) {
      handleError('Could not save current activity.', e);
    }
  }

  async function getCurrentActivity(): Promise<void> {
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
          setCurrentActivityLabel(result.activityState);
        }
      }
    } catch (e) {
      handleError('Could not get current activity.', e);
    }
  }

  return {
    startActivity,
    endActivity,
    getCurrentActivity,
    activityRunning,
    currentActivityLabel,
  };
}
