import { useEffect } from 'react';
import useAppData from '../modules/useAdmin';
import { URLS } from '../constants/urls';
import { postData } from '../utils/dataUtils'; // adjust path as needed

export default function DataAdder({ payloads }) {
  const { setLoading, setError, setData } = useAppData();

  useEffect(() => {
    const addData = async () => {
      setLoading(true);
      const results = {};

      try {
        for (const [groupKey, group] of Object.entries(URLS)) {
          if (!payloads[groupKey]) continue;
          const addUrl = group.add;
          const payload = payloads[groupKey];

          try {
            const data = await postData(addUrl, payload);
            results[groupKey] = data;
          } catch (error) {
            console.error(`Error adding ${groupKey}:`, error);
            setError(`Failed to add ${groupKey}: ${error.message}`);
          }
        }

        setData(results);
      } finally {
        setLoading(false);
      }
    };

    addData();
  }, []);
}
