import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Track } from '@/constants/tracks';
import { Colors } from '@/constants/colors';
import { Theme } from '@/constants/theme';

interface TrackCardProps {
  track: Track;
  onPress: (track: Track) => void;
  isPlaying?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TrackCard({ track, onPress, isPlaying }: TrackCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(track)}
      activeOpacity={0.8}
      style={styles.wrapper}
    >
      <View style={[styles.card, isPlaying && styles.cardActive]}>
        {/* Color swatch */}
        <LinearGradient
          colors={track.coverGradient}
          style={styles.swatch}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.genreEmoji}>
            {track.genre === 'nature'
              ? '🌿'
              : track.genre === 'ambient'
              ? '🌌'
              : track.genre === 'binaural'
              ? '🧠'
              : track.genre === 'classical'
              ? '🎻'
              : '🧘'}
          </Text>
        </LinearGradient>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist}>{track.artist}</Text>
          <Text style={styles.description} numberOfLines={1}>
            {track.description}
          </Text>
        </View>

        {/* Duration + playing indicator */}
        <View style={styles.right}>
          <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
          {isPlaying && (
            <View style={styles.playingDot} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.card,
    borderRadius: Theme.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    gap: 12,
  },
  cardActive: {
    borderColor: Colors.accent.lavender,
    backgroundColor: 'rgba(167,139,250,0.1)',
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreEmoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Theme.fontSize.md,
    fontFamily: Theme.fontFamily.bodySemiBold,
  },
  artist: {
    color: Colors.accent.lavender,
    fontSize: Theme.fontSize.xs,
    fontFamily: Theme.fontFamily.body,
  },
  description: {
    color: Colors.text.secondary,
    fontSize: Theme.fontSize.xs,
    fontFamily: Theme.fontFamily.body,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  duration: {
    color: Colors.text.muted,
    fontSize: Theme.fontSize.xs,
    fontFamily: Theme.fontFamily.body,
  },
  playingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.lavender,
  },
});
