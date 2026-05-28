import React, { memo } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  padded?: boolean;
  style?: ViewStyle;
  stickyFooter?: React.ReactNode;
  edges?: Edge[];
}

export const ScreenContainer = memo(function ScreenContainer({
  children,
  scrollable = false,
  backgroundColor = theme.colors.background,
  padded = true,
  style,
  stickyFooter,
  edges = ['bottom'],
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const hasStickyFooter = stickyFooter != null;

  // useAnimatedKeyboard() tracks keyboard height on the UI thread, frame by
  // frame, in sync with the native animation. This avoids the "jump" caused
  // by keyboardDidShow (which fires only after the animation ends on Android).
  // Requires softwareKeyboardLayoutMode: 'pan' in app.config.ts — see CLAUDE.md
  // gotcha 21. Works identically on iOS and Android.
  const keyboard = useAnimatedKeyboard();

  // When the keyboard is closed, keep at least the safe-area bottom inset
  // (home indicator / nav bar clearance). When it is open, lift by the exact
  // keyboard height reported by the native layer.
  const animatedFooterStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.value, insets.bottom),
  }));

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, padded && styles.padded]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={Keyboard.dismiss} accessible={false} style={styles.pressableFill}>
        {children}
      </Pressable>
    </ScrollView>
  ) : (
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  );

  // Sticky-footer path: Animated.View + useAnimatedKeyboard for smooth,
  // frame-synchronised lift on both iOS and Android.
  if (hasStickyFooter) {
    const topPad = edges.includes('top') ? insets.top : 0;
    return (
      <Animated.View
        style={[styles.safe, { backgroundColor, paddingTop: topPad }, animatedFooterStyle]}
      >
        {content}
        <View style={[styles.footer, padded && styles.padded]}>{stickyFooter}</View>
      </Animated.View>
    );
  }

  // Default path (no sticky footer): SafeAreaView + Animated.View.
  // KeyboardAvoidingView removed — same useAnimatedKeyboard strategy applies.
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={edges}>
      <Animated.View style={[styles.keyboardAvoiding, animatedFooterStyle]}>
        {content}
      </Animated.View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create<{
  safe: ViewStyle;
  keyboardAvoiding: ViewStyle;
  inner: ViewStyle;
  padded: ViewStyle;
  scroll: ViewStyle;
  scrollContent: ViewStyle;
  footer: ViewStyle;
  pressableFill: ViewStyle;
}>({
  safe: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.huge,
  },
  footer: {
    paddingTop: theme.spacing.md,
  },
  pressableFill: {
    flex: 1,
  },
});
