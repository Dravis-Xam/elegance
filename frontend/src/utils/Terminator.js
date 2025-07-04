import { useEffect } from 'react';
import useAppData from '../modules/useAdmin';
import { URLS } from '../constants/urls';
import { deleteData } from '../utils/dataUtils';

export default function DataDeleter({ targets }) {
  const { setLoading, setError, setData } = useAppData();

  useEffect(() => {
    const deleteItems = async () => {
      setLoading(true);
      const results = {};

      try {
        for (const [groupKey, group] of Object.entries(URLS)) {
          if (!targets[groupKey]) continue;

          const id = targets[groupKey];
          const deleteUrl = group.delete + id;

          try {
            const data = await deleteData(deleteUrl);
            results[groupKey] = data;
          } catch (error) {
            console.error(`Error deleting ${groupKey}:`, error);
            setError(`Failed to delete ${groupKey}: ${error.message}`);
          }
        }

        setData(results);
      } finally {
        setLoading(false);
      }
    };

    deleteItems();
  }, []);
}
