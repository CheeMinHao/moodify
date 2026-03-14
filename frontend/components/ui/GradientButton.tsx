import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';
import { Colors } from '@/constants/colors';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  colors?: [string, string];
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  colors = Colors.gradients.lavender,
  style,
  loading = false,
  disabled = false,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={disabled ? ['#2D2D3A', '#1A1D2E'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Theme.radius.full,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.text.primary,
    fontSize: Theme.fontSize.md,
    fontFamily: Theme.fontFamily.bodyBold,
    letterSpacing: 0.5,
  },
});
