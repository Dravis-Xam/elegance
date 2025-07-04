import { useEffect } from 'react';
import useAppData from '../modules/useAdmin';
import { URLS } from '../constants/urls';
import { putData } from '../utils/dataUtils';

export default function DataEditor({ updates }) {
  const { setLoading, setError, setData } = useAppData();

  useEffect(() => {
    const editData = async () => {
      setLoading(true);
      const results = {};

      try {
        for (const [groupKey, group] of Object.entries(URLS)) {
          if (!updates[groupKey]) continue;

          const { id, payload } = updates[groupKey];
          const editUrl = group.edit + id;

          try {
            const data = await putData(editUrl, payload);
            results[groupKey] = data;
          } catch (error) {
            console.error(`Error editing ${groupKey}:`, error);
            setError(`Failed to edit ${groupKey}: ${error.message}`);
          }
        }

        setData(results);
      } finally {
        setLoading(false);
      }
    };

    editData();
  }, []);
}
