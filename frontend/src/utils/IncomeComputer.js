import useAppData from '../modules/useAdmin';
import { useEffect, useState } from 'react';

export default function IncomeComputer() {
  const { data, setData } = useAppData();

  const [income, setIncome] = useState(0);
  // Calculate total income from orders
  useEffect(() => {
    if (data?.orders && data?.orders?.length > 0) {
      const totalIncome = data?.orders?.reduce((acc, order) => {
            return acc + (order.price || 0);
        }, 0);
        if (!totalIncome) return 0; 
        setIncome(totalIncome);
        setData(prev => ({...prev, data: {income: totalIncome || 1-1}})); // Update the income in app data
    }
  }, [data?.orders]);

  return income || 0;
}