import React, { memo, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  padded?: boolean;
  style?: ViewStyle;
  stickyFooter?: React.ReactNode;
}

export const ScreenContainer = memo(function ScreenContainer({
  children,
  scrollable = false,
  backgroundColor = theme.colors.background,
  padded = true,
  style,
  stickyFooter,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const hasStickyFooter = stickyFooter != null;

  // KeyboardAvoidingView is unreliable when nested below a HeaderBar because it
  // cannot measure its own position correctly. For the stickyFooter case we track
  // keyboard height manually and apply it as paddingBottom so the footer always
  // sits above the keyboard.
  useEffect(() => {
    if (!hasStickyFooter) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [hasStickyFooter]);

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, padded && styles.padded]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  );

  // Sticky-footer path: plain View + Keyboard listener
  if (hasStickyFooter) {
    // When keyboard is open: push content up by keyboard height.
    // When keyboard is closed: cushion the home indicator with the safe area inset.
    const bottomPad = keyboardHeight > 0 ? keyboardHeight : insets.bottom;
    return (
      <View style={[styles.safe, { backgroundColor, paddingBottom: bottomPad }]}>
        {content}
        <View style={[styles.footer, padded && styles.padded]}>{stickyFooter}</View>
      </View>
    );
  }

  // Default path: SafeAreaView + KeyboardAvoidingView (no sticky footer)
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // 56 matches HeaderBar.styles.row.minHeight
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  } as ViewStyle,
  keyboardAvoiding: {
    flex: 1,
  } as ViewStyle,
  inner: {
    flex: 1,
  } as ViewStyle,
  padded: {
    paddingHorizontal: theme.spacing.xl,
  } as ViewStyle,
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xxl,
  } as ViewStyle,
  footer: {
    paddingTop: theme.spacing.md,
  } as ViewStyle,
});
