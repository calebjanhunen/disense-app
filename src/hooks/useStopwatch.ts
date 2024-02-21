import { handleError } from '@/utils/error-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInSeconds } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface IUseStopwatch {
  timeDisplay: string;
  startStopwatch: () => void;
  stopStopwatch: () => void;
}

export function useStopwatch(): IUseStopwatch {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  /* The `useEffect` hook in the provided code snippet is setting up a subscription to listen for
  changes in the application state using `AppState.addEventListener`. */
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    getVariablesOnRerender();

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - (startTime ?? Date.now()));
      }, 1000);
    } else if (!isRunning && startTime != null) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, startTime]);

  // async function getElapsedTimeOnAppReEntry() {
  //   const elapsedTime = await getElapsedTime();
  //   console.log(elapsedTime);
  //   if (elapsedTime) {
  //     setElapsedTime(elapsedTime);
  //   }
  // }

  async function storeVariablesOnStopwatchStart() {
    try {
      await AsyncStorage.setItem('is_timer_running', 'true');
      const now = new Date();
      await AsyncStorage.setItem('start_time', now.toISOString());
    } catch (e) {
      handleError('Could not store timer', e);
    }
  }

  async function getVariablesOnRerender() {
    try {
      const isTimerRunning = await AsyncStorage.getItem('is_timer_running');
      if (isTimerRunning === 'true') {
        setIsRunning(true);
      }
      const startTime = await AsyncStorage.getItem('start_time');
      if (startTime) {
        setStartTime(Date.parse(startTime));
      }
    } catch (e) {
      handleError('Could not get timer', e);
    }
  }

  async function removeVariablesOnStopwatchEnd() {
    try {
      await AsyncStorage.removeItem('is_timer_running');
      await AsyncStorage.removeItem('start_time');
    } catch (e) {
      handleError('Could not remove timer', e);
    }
  }

  /**
   * Updates elapsed time and time display when the app transitions
   * from inactive or background to active state.
   * @param {AppStateStatus} nextAppState - Represents the next state that
   * the application is transitioning to. It is of type `AppStateStatus`.
   */
  async function handleAppStateChange(nextAppState: AppStateStatus) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const elapsed = await getElapsedTime();
      if (elapsed) {
        setElapsedTime(elapsed);
      }
    }
    appState.current = nextAppState;
  }

  /**
   * Retrieves the start time from AsyncStorage and calculates the elapsed time in
   * seconds since that start time.
   *
   * @returns The time difference in seconds between the current time (`now`) and the stored
   * start time retrieved from AsyncStorage. If an error occurs during
   * the process of getting the start time, a warning message will be logged to the console.
   */
  async function getElapsedTime() {
    try {
      const startTime = await AsyncStorage.getItem('start_time');
      const now = new Date();
      if (startTime) return differenceInSeconds(now, Date.parse(startTime));
    } catch (e) {
      console.warn('could not get start time: ', e);
    }
  }

  /**
   * The `startStopwatch` function starts a stopwatch by recording the start time, updating the elapsed
   * time every second, and setting an interval ID.
   */
  async function startStopwatch() {
    setStartTime(Date.now());
    setIsRunning(true);
    await storeVariablesOnStopwatchStart();
  }

  /**
   * The function `stopStopwatch` resets the elapsed time, time display, and clears the interval timer
   * if it is running.
   */
  async function stopStopwatch() {
    setElapsedTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    await removeVariablesOnStopwatchEnd();
  }

  /**
   * The function `formatTime` takes an elapsed time in seconds and returns a formatted string in the
   * format "hh:mm:ss".
   * @param {number} elapsedTime - The `elapsedTime` parameter represents the total elapsed time in
   * seconds that you want to format into a human-readable time format (HH:MM:SS).
   * @returns The function `formatTime` takes an `elapsedTime` in seconds and returns a formatted time
   * string in the format "hours:minutes:seconds".
   */
  function formatTime(time: number) {
    const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
    const minutes = String(Math.floor((time / 1000 / 60) % 60)).padStart(
      2,
      '0'
    );
    const hours = String(Math.floor(time / 1000 / 3600)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  return {
    startStopwatch,
    stopStopwatch,
    timeDisplay: formatTime(elapsedTime),
  };
}
