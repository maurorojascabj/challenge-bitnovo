import BitnovoLogo from '@/assets/svg/Bitnovo-logo.svg';
import ArrowLeftIcon from '@/assets/svg/arrow-left.svg';
import { Typography } from '@/components/atoms/Typography';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.row}>
        {/* Absolutely centered title/logo — full row width, never squeezed by side elements */}
        <View style={styles.center} pointerEvents="none">
          {showLogo ? (
            <BitnovoLogo width={120} height={32} />
          ) : title ? (
            <Typography
              variant="h3"
              align="center"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {title}
            </Typography>
          ) : null}
        </View>

        {/* Left: back button — rendered above the center layer */}
        <View style={styles.sideLeft}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={8}>
              <ArrowLeftIcon width={28} height={28} />
            </TouchableOpacity>
          )}
        </View>

        {/* Right — flex:1 pushes it to the right edge */}
        <View style={styles.sideRight}>{rightElement}</View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  } as ViewStyle,
  // Fills the entire row area; title text is padded inward to clear side buttons
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 90,
  } as ViewStyle,
  sideLeft: {
    zIndex: 1,
  } as ViewStyle,
  sideRight: {
    flex: 1,
    alignItems: 'flex-end',
    zIndex: 1,
  } as ViewStyle,
  backButton: {
    alignSelf: 'flex-start',
  } as ViewStyle,
});
