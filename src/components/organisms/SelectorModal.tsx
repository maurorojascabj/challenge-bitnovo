import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  SafeAreaView,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';
import { useDebounce } from '@/hooks/useDebounce';

export interface SelectorItem {
  key: string;
  title?: string;
  name?: string;
  details?: string;
  value?: string;
  icon: React.FC<{ width?: number; height?: number }>;
}

interface SelectorModalProps<T extends SelectorItem> {
  visible: boolean;
  items: T[];
  onSelect: (item: T) => void;
  onClose: () => void;
  title: string;
  searchKeys?: (keyof T)[];
  renderItem?: (item: T) => React.ReactNode;
}

function SelectorModalInner<T extends SelectorItem>({
  visible,
  items,
  onSelect,
  onClose,
  title,
  searchKeys = ['title', 'details', 'name', 'value'] as (keyof T)[],
  renderItem,
}: SelectorModalProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 150);
  const translateY = useSharedValue(600);

  useEffect(() => {
    translateY.value = visible
      ? withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) })
      : withTiming(600, { duration: 250, easing: Easing.in(Easing.cubic) });
    if (!visible) setQuery('');
  }, [visible, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filtered = debouncedQuery
    ? items.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key];
          return typeof val === 'string' && val.toLowerCase().includes(debouncedQuery.toLowerCase());
        })
      )
    : items;

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      onClose();
    },
    [onSelect, onClose]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[styles.sheet, animStyle]}>
        <SafeAreaView style={styles.safeArea}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          <View style={styles.header}>
            <Typography variant="h3">{title}</Typography>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Typography variant="body" color={theme.colors.textSecondary}>
                ✕
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrapper}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar..."
              placeholderTextColor={theme.colors.neutral[400]}
              style={styles.searchInput}
              clearButtonMode="while-editing"
              autoCorrect={false}
              selectionColor={theme.colors.primary[500]}
            />
          </View>

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) =>
              renderItem ? (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  {renderItem(item)}
                </TouchableOpacity>
              ) : (
                <DefaultRow item={item} onPress={() => handleSelect(item)} />
              )
            }
          />
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

export const SelectorModal = memo(SelectorModalInner) as typeof SelectorModalInner;

interface DefaultRowProps<T extends SelectorItem> {
  item: T;
  onPress: () => void;
}

function DefaultRow<T extends SelectorItem>({ item, onPress }: DefaultRowProps<T>) {
  const Icon = item.icon;
  const label = (item.title ?? item.name) as string;
  const sub = (item.details ?? item.value) as string;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>
        <Icon width={28} height={28} />
      </View>
      <View style={styles.rowText}>
        <Typography variant="bodySemibold">{label}</Typography>
        {sub ? (
          <Typography variant="small" color={theme.colors.textSecondary}>
            {sub}
          </Typography>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  } as ViewStyle,
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    maxHeight: '85%',
    ...theme.shadows.modal,
  } as ViewStyle,
  safeArea: {
    flex: 1,
  } as ViewStyle,
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral[300],
    alignSelf: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  } as ViewStyle,
  searchWrapper: {
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing.md,
  } as ViewStyle,
  searchInput: {
    height: 44,
    fontSize: 16,
    color: theme.colors.textPrimary,
  } as TextStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[100],
  } as ViewStyle,
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } as ViewStyle,
  rowText: {
    flex: 1,
    gap: 2,
  } as ViewStyle,
});
