import React, { memo, useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { SelectorRow } from '@/components/molecules/SelectorRow';
import { SelectorModal } from './SelectorModal';
import { COUNTRY_LIST, CountryItem } from '@/constants/countries';

interface WhatsAppModalProps {
  visible: boolean;
  onClose: () => void;
  onSend: (countryCode: string, phone: string) => void;
}

export const WhatsAppModal = memo(function WhatsAppModal({
  visible,
  onClose,
  onSend,
}: WhatsAppModalProps) {
  const [country, setCountry] = useState<CountryItem>(COUNTRY_LIST[0]);
  const [phone, setPhone] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const Icon = country.icon;

  const handleSend = () => {
    if (!phone.trim()) return;
    onSend(country.value, phone.trim());
    setPhone('');
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <SafeAreaView style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Typography variant="h3">Enviar por WhatsApp</Typography>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Typography variant="body" color={theme.colors.textSecondary}>
                ✕
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Country selector */}
          <View style={styles.body}>
            <Typography variant="smallSemibold" color={theme.colors.textSecondary}>
              País
            </Typography>
            <SelectorRow
              icon={<Icon width={28} height={28} />}
              title={country.name}
              detail={country.value}
              onPress={() => setShowCountryPicker(true)}
            />

            {/* Phone input */}
            <Typography
              variant="smallSemibold"
              color={theme.colors.textSecondary}
              style={styles.phoneLabel}
            >
              Número de teléfono
            </Typography>
            <View style={styles.phoneRow}>
              <View style={styles.codeBox}>
                <Typography variant="bodySemibold" color={theme.colors.primary[500]}>
                  {country.value}
                </Typography>
              </View>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="600 000 000"
                placeholderTextColor={theme.colors.neutral[300]}
                style={styles.phoneInput}
                selectionColor={theme.colors.primary[500]}
              />
            </View>

            <Button
              label="Enviar enlace"
              onPress={handleSend}
              fullWidth
              disabled={!phone.trim()}
              style={styles.sendBtn}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Country picker nested modal */}
      <SelectorModal
        visible={showCountryPicker}
        items={COUNTRY_LIST}
        title="Seleccionar país"
        onSelect={(item) => setCountry(item)}
        onClose={() => setShowCountryPicker(false)}
      />
    </>
  );
});

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
    ...theme.shadows.modal,
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
  body: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.sm,
  } as ViewStyle,
  phoneLabel: {
    marginTop: theme.spacing.md,
  } as TextStyle,
  phoneRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  } as ViewStyle,
  codeBox: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[50],
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    minWidth: 64,
    alignItems: 'center',
  } as ViewStyle,
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    height: 52,
  } as TextStyle,
  sendBtn: {
    marginTop: theme.spacing.lg,
  } as ViewStyle,
});
