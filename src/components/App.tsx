import { useEffect } from 'react';
import { Layout } from './layout/Layout';
import { Table } from './layout/Table';
import { useAppStore } from '../store';
import { useKeyboardNavigation } from '../app/hooks/useKeyboardNavigation';

export const App = () => {
  const selectDate = useAppStore((state) => state.selectDate);

  const date = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  })();

  useEffect(() => {
    selectDate(date);
  }, [date, selectDate]);

  // Handle keyboard navigation for task selection
  useKeyboardNavigation();

  return (
    <Layout>
      <Table />
    </Layout>
  );
};
