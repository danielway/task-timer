import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  startTime,
  stopTime,
  selectActiveTimer,
} from '../../app/slices/timeSlice';

interface TimerButtonProps {
  taskId: number;
  date: number;
}

export const TimerButton = ({ taskId, date }: TimerButtonProps) => {
  const dispatch = useAppDispatch();
  const activeTimer = useAppSelector(selectActiveTimer);
  const [elapsedTime, setElapsedTime] = useState(0);

  const isActiveForThisTask = activeTimer?.taskId === taskId;
  const isActiveForOtherTask = activeTimer && !isActiveForThisTask;

  // Update elapsed time every second when timer is active for this task
  useEffect(() => {
    if (!isActiveForThisTask || !activeTimer) {
      setElapsedTime(0);
      return;
    }

    const updateElapsed = () => {
      const elapsed = Date.now() - activeTimer.startTime;
      setElapsedTime(elapsed);
    };

    // Update immediately
    updateElapsed();

    // Then update every second
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [isActiveForThisTask, activeTimer]);

  const formatElapsedTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (isActiveForThisTask) {
      dispatch(stopTime());
    } else {
      dispatch(startTime({ date, taskId }));
    }
  };

  return (
    <Button
      size="small"
      variant={isActiveForThisTask ? 'contained' : 'outlined'}
      color={isActiveForThisTask ? 'error' : 'primary'}
      onClick={handleClick}
      disabled={isActiveForOtherTask}
      startIcon={isActiveForThisTask ? <StopIcon /> : <PlayArrowIcon />}
      sx={{ minWidth: '140px', fontSize: '0.75rem' }}
    >
      {isActiveForThisTask
        ? `${formatElapsedTime(elapsedTime)}`
        : 'Start Timer'}
    </Button>
  );
};
