'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface School {
  id: string;
  name: string;
}

interface SchoolContextType {
  school: School | null;
  isLoading: boolean;
  setSchool: (school: School | null) => void;
  clearSchool: () => void;
}

const STORAGE_KEY = 'sm-school';

const SchoolContext = createContext<SchoolContextType | undefined>(
  undefined,
);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [school, setSchoolState] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSchool = useCallback((value: School | null) => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist school data to localStorage:', error);
    }
  }, []);

  const setSchool = useCallback(
    (value: School | null) => {
      setSchoolState(value);
      persistSchool(value);
    },
    [persistSchool],
  );

  const clearSchool = useCallback(() => {
    setSchool(null);
  }, [setSchool]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as School | null;
        setSchoolState(parsed);
      }
    } catch (error) {
      console.error('Failed to read school data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }
      if (!event.newValue) {
        setSchoolState(null);
        return;
      }
      try {
        const parsed = JSON.parse(event.newValue) as School | null;
        setSchoolState(parsed);
      } catch (error) {
        console.error('Failed to parse school data from storage event:', error);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      school,
      isLoading,
      setSchool,
      clearSchool,
    }),
    [school, isLoading, setSchool, clearSchool],
  );

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}

