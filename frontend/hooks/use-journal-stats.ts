import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/auth';
import { Emotions } from '@/constants/emotions';

interface JournalStats {
  sessionCount: number;
  streak: number;
  recentMoods: string[];
  loading: boolean;
  refresh: () => Promise<void>;
}

// Simple event emitter for cross-component invalidation
type Listener = () => void;
const listeners = new Set<Listener>();

export function invalidateJournalStats() {
  listeners.forEach((fn) => fn());
}

export function useJournalStats(): JournalStats {
  const { user } = useAuth();
  const [sessionCount, setSessionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentMoods, setRecentMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;

    const [countRes, moodsRes, entriesRes] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('journal_entries')
        .select('emotion')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('journal_entries')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
    ]);

    setSessionCount(countRes.count ?? 0);

    if (moodsRes.data) {
      setRecentMoods(
        moodsRes.data.map((entry) => {
          const emotion = Emotions.find(
            (e) => e.id.toLowerCase() === entry.emotion.toLowerCase(),
          );
          return emotion?.emoji ?? '🎵';
        }),
      );
    }

    if (entriesRes.data && entriesRes.data.length > 0) {
      const uniqueDays = [
        ...new Set(
          entriesRes.data.map((e) => new Date(e.created_at).toDateString()),
        ),
      ];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDay = new Date(uniqueDays[0]);
      firstDay.setHours(0, 0, 0, 0);

      const diffFromToday = Math.floor(
        (today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffFromToday > 1) {
        setStreak(0);
      } else {
        let consecutive = 1;
        for (let i = 1; i < uniqueDays.length; i++) {
          const curr = new Date(uniqueDays[i - 1]);
          const prev = new Date(uniqueDays[i]);
          curr.setHours(0, 0, 0, 0);
          prev.setHours(0, 0, 0, 0);
          const diff = Math.floor(
            (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
          );
          if (diff === 1) {
            consecutive++;
          } else {
            break;
          }
        }
        setStreak(consecutive);
      }
    } else {
      setStreak(0);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  // Subscribe to invalidation events
  useEffect(() => {
    const handler = () => {
      refresh();
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, [refresh]);

  return { sessionCount, streak, recentMoods, loading, refresh };
}
