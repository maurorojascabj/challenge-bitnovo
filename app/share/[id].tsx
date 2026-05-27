import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { theme } from '@/theme';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { HeaderBar } from '@/components/templates/HeaderBar';
import { Typography } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { ShareOption } from '@/components/molecules/ShareOption';
import { Toast } from '@/components/organisms/Toast';
import { WhatsAppModal } from '@/components/organisms/WhatsAppModal';
import { useOrderStore } from '@/store/useOrderStore';
import { usePaymentStatus } from '@/features/payments/hooks/usePaymentStatus';
import { useShareLinks } from '@/features/payments/hooks/useShareLinks';

import WhatsAppIcon from '@/assets/svg/whatsapp.svg';
import SmsIcon from '@/assets/svg/sms.svg';
import ExportIcon from '@/assets/svg/export.svg';
import ScanBarcodeIcon from '@/assets/svg/scan-barcode.svg';
import LinkIcon from '@/assets/svg/link.svg';
import WalletAddIcon from '@/assets/svg/wallet-add.svg';

export default function SharePaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrderStore((s) => s.order);
  const clearOrder = useOrderStore((s) => s.clearOrder);

  const [showWA, setShowWA] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Realtime WS — auto navigates to /success on completion
  usePaymentStatus(id);

  const webUrl = order?.web_url ?? '';
  const { shareWhatsApp, shareEmail, shareNative } = useShareLinks({ webUrl });

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    },
    []
  );

  const handleCopyUrl = async () => {
    await Clipboard.setStringAsync(webUrl);
    showToast('Enlace copiado al portapapeles');
  };

  const handleNewRequest = () => {
    clearOrder();
    router.replace('/');
  };

  return (
    <>
      <HeaderBar title="Compartir pago" showBack />
      <ScreenContainer>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Amount */}
          {order && (
            <View style={styles.amountCard}>
              <Typography variant="caption" color={theme.colors.textSecondary} align="center">
                Importe a cobrar
              </Typography>
              <Typography variant="h1" align="center" color={theme.colors.primary[500]}>
                {order.fiat_amount} {order.fiat}
              </Typography>
            </View>
          )}

          {/* Payment URL */}
          <View style={styles.urlSection}>
            <Typography variant="smallSemibold" color={theme.colors.textSecondary}>
              Enlace de pago
            </Typography>
            <TouchableOpacity onPress={handleCopyUrl} activeOpacity={0.8} style={styles.urlRow}>
              <LinkIcon width={20} height={20} />
              <Typography
                variant="small"
                color={theme.colors.primary[500]}
                style={styles.urlText}
                numberOfLines={1}
              >
                {webUrl}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Share options */}
          <View style={styles.shareGrid}>
            <ShareOption
              icon={<WhatsAppIcon width={28} height={28} />}
              label="WhatsApp"
              onPress={() => setShowWA(true)}
            />
            <ShareOption
              icon={<SmsIcon width={28} height={28} />}
              label="Email"
              onPress={shareEmail}
            />
            <ShareOption
              icon={<ExportIcon width={28} height={28} />}
              label="Compartir"
              onPress={shareNative}
            />
            <ShareOption
              icon={<ScanBarcodeIcon width={28} height={28} />}
              label="Ver QR"
              onPress={() => router.push(`/qr/${id}`)}
            />
          </View>
        </ScrollView>

        {/* Nueva solicitud */}
        <View style={styles.footer}>
          <Button
            label="Nueva Solicitud"
            variant="ghost"
            onPress={handleNewRequest}
            fullWidth
            leftIcon={<WalletAddIcon width={20} height={20} />}
          />
        </View>
      </ScreenContainer>

      {/* WhatsApp modal */}
      <WhatsAppModal
        visible={showWA}
        onClose={() => setShowWA(false)}
        onSend={shareWhatsApp}
      />

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.xl,
  } as ViewStyle,
  amountCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
    ...theme.shadows.card,
  } as ViewStyle,
  urlSection: {
    gap: theme.spacing.sm,
  } as ViewStyle,
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
  } as ViewStyle,
  urlText: {
    flex: 1,
    textDecorationLine: 'underline',
  } as TextStyle,
  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  } as ViewStyle,
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  } as ViewStyle,
});
