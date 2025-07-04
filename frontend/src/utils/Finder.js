import { useEffect } from 'react';
import useAppData from '../modules/useAdmin';
import { URLS } from '../constants/urls';
import { searchData } from '../utils/dataUtils';

export default function DataSearcher({ queries }) {
  const { setLoading, setError, setData } = useAppData();

  useEffect(() => {
    const searchItems = async () => {
      setLoading(true);
      const results = {};

      try {
        for (const [groupKey, group] of Object.entries(URLS)) {
          if (!queries[groupKey]) continue;

          const query = queries[groupKey];
          const searchUrl = group.search;

          try {
            const data = await searchData(searchUrl, query);
            results[groupKey] = data;
          } catch (error) {
            console.error(`Error searching ${groupKey}:`, error);
            setError(`Failed to search ${groupKey}: ${error.message}`);
          }
        }

        setData(results);
      } finally {
        setLoading(false);
      }
    };

    searchItems();
  }, []);
}
