import { useEffect, useState } from 'react';

function getSessionStorageOrDefault<T>(key: string, defaultValue: T): T {
  const stored = window.sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored) as T;
}

export function useSessionStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(
    getSessionStorageOrDefault(key, defaultValue)
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
