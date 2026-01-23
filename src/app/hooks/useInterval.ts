import { useEffect, useRef } from 'react';

// Invokes a callback on an interval in a React-friendly way.
// Derived from https://overreacted.io/making-setinterval-declarative-with-react-hooks.
export const useInterval = (callback: () => void, delay: number) => {
  const intervalRef = useRef<number | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    intervalRef.current = window.setInterval(tick, delay);
    return () => window.clearInterval(intervalRef.current!);
  }, [delay]);
  return intervalRef;
};
