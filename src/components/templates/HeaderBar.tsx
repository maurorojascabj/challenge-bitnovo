import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';
import BitnovoLogo from '@/assets/svg/Bitnovo-logo.svg';

interface HeaderBarProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const HeaderBar = memo(function HeaderBar({
  title,
  showLogo = false,
  showBack = false,
  rightElement,
}: HeaderBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Left: back button */}
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Typography variant="body" color={theme.colors.primary[500]}>
              ← Volver
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Center: logo or title */}
      <View style={styles.center}>
        {showLogo ? (
          <BitnovoLogo width={120} height={32} />
        ) : title ? (
          <Typography variant="h3" align="center">
            {title}
          </Typography>
        ) : null}
      </View>

      {/* Right */}
      <View style={styles.side}>{rightElement}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    minHeight: 56,
  } as ViewStyle,
  side: {
    flex: 1,
  } as ViewStyle,
  center: {
    flex: 2,
    alignItems: 'center',
  } as ViewStyle,
  backButton: {
    alignSelf: 'flex-start',
  } as ViewStyle,
});
