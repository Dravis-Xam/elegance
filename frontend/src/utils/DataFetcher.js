// src/components/DataFetcher.js

import { useEffect } from 'react';
import useAppData from '../modules/useAdmin'; // hook: provides setLoading, setError, setData
import { URLS } from '../constants/urls';     // all backend endpoint URLs
import { fetchData } from '../utils/api';     // your centralized GET request function

export default function DataFetcher() {
  const { setLoading, setError, setData } = useAppData();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const results = {};
      const SAFE_KEYS = ['list']; // only fetch GET-safe endpoints

      try {
        for (const [groupKey, group] of Object.entries(URLS)) {
          results[groupKey] = {};

          for (const [key, url] of Object.entries(group)) {
            if (!SAFE_KEYS.includes(key)) continue;

            try {
              const data = await fetchData(url);
              results[groupKey][key] = data;
            } catch (error) {
              console.error(`Error fetching ${groupKey}.${key}:`, error);
              setError(`Failed to load ${groupKey}.${key}: ${error.message}`);
            }
          }
        }

        setData(results);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
}
