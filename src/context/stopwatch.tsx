import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInSeconds } from 'date-fns';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export interface IStopwatchContext {
  timerDisplay: string;
  startTestStopwatch: () => void;
  stopTestStopwatch: () => void;
}

export const StopwatchContext = createContext<IStopwatchContext>(
  {} as IStopwatchContext
);

export function StopwatchProvider({ children }: Props) {
  console.log('rendereds');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string>('00:00:00');
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  async function handleAppStateChange(nextAppState: AppStateStatus) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const elapsed = await getElapsedTime();
      if (elapsed) {
        setElapsedTime(elapsed);
        setTimerDisplay(formatTime(elapsed));
      }
    }
    appState.current = nextAppState;
  }

  async function getElapsedTime() {
    try {
      const startTime = await AsyncStorage.getItem('start_time');
      const now = new Date();
      if (startTime) return differenceInSeconds(now, Date.parse(startTime));
    } catch (e) {
      console.warn('could not get start time: ', e);
    }
  }

  async function recordStartTime() {
    try {
      const now = new Date();
      await AsyncStorage.setItem('start_time', now.toISOString());
    } catch (e) {
      console.warn('could not save start time: ', e);
    }
  }

  function startTestStopwatch() {
    recordStartTime();
    const id = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        setTimerDisplay(formatTime(newTime));
        return newTime;
      });
    }, 1000);
    setTimerId(id);
  }

  function stopTestStopwatch() {
    setElapsedTime(0);
    setTimerDisplay('00:00:00');
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }

  function formatTime(elapsedTime: number) {
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    const minutes = String(Math.floor(elapsedTime / 60) % 60).padStart(2, '0');
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <StopwatchContext.Provider
      value={{ startTestStopwatch, stopTestStopwatch, timerDisplay }}
    >
      {children}
    </StopwatchContext.Provider>
  );
}
