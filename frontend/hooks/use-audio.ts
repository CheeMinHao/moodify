import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Track } from '@/constants/tracks';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  position: number;
  error: string | null;
}

export function useAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    position: 0,
    error: null,
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const loadAndPlay = useCallback(async (track: Track) => {
    try {
      setState((s) => ({ ...s, isLoading: true, error: null }));

      // Unload previous
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setState((s) => ({
              ...s,
              isPlaying: status.isPlaying,
              duration: status.durationMillis ?? 0,
              position: status.positionMillis ?? 0,
              isLoading: false,
            }));
          }
        }
      );

      soundRef.current = sound;
      setCurrentTrack(track);
    } catch (err) {
      console.error('Audio load error:', err);
      setState((s) => ({
        ...s,
        isLoading: false,
        error: 'Could not load audio',
      }));
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    if (state.isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, [state.isPlaying]);

  const seek = useCallback(async (positionMillis: number) => {
    await soundRef.current?.setPositionAsync(positionMillis);
  }, []);

  const stop = useCallback(async () => {
    await soundRef.current?.stopAsync();
    setCurrentTrack(null);
  }, []);

  return {
    currentTrack,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    duration: state.duration,
    position: state.position,
    error: state.error,
    loadAndPlay,
    togglePlayPause,
    seek,
    stop,
  };
}
