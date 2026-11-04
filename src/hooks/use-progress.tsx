import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// クリアしたレベルの記録。端末内 (AsyncStorage) に保存する。

const STORAGE_KEY = "progress/v1";

type Progress = {
  // レベル ID → 初めてクリアした日時 (ISO 文字列)
  clearedAt: Record<string, string>;
};

type ProgressContextValue = {
  loaded: boolean;
  isCleared: (levelId: string) => boolean;
  markCleared: (levelId: string) => void;
  clearedLevelIds: string[];
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>({ clearedAt: {} });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) setProgress(JSON.parse(json));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const markCleared = useCallback((levelId: string) => {
    setProgress((prev) => {
      if (prev.clearedAt[levelId]) return prev;
      const next = { clearedAt: { ...prev.clearedAt, [levelId]: new Date().toISOString() } };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isCleared = useCallback((levelId: string) => Boolean(progress.clearedAt[levelId]), [progress]);

  return (
    <ProgressContext.Provider
      value={{ loaded, isCleared, markCleared, clearedLevelIds: Object.keys(progress.clearedAt) }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress は ProgressProvider の中で使ってください");
  return value;
}
