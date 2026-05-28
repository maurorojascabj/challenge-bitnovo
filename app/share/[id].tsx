import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BlurView } from 'expo-blur';

import { Button } from '@/components/atoms/Button';
import { Typography } from '@/components/atoms/Typography';
import { PaymentSummaryCard } from '@/components/molecules/PaymentSummaryCard';
import { ShareRow } from '@/components/molecules/ShareRow';
import { WhatsAppShareRow } from '@/components/molecules/WhatsAppShareRow';
import { Toast } from '@/components/organisms/Toast';
import { ScreenContainer } from '@/components/templates/ScreenContainer';
import { FiatKey } from '@/constants/currencies';
import { formatAmountWithSymbol } from '@/utils';
import { usePaymentStatus } from '@/features/payments/hooks/usePaymentStatus';
import { useShareLinks } from '@/features/payments/hooks/useShareLinks';
import { useCountrySelectionStore } from '@/store/useCountrySelectionStore';
import { useOrderStore } from '@/store/useOrderStore';
import { theme } from '@/theme';

import ExportIcon from '@/assets/svg/export.svg';
import LinkIcon from '@/assets/svg/link.svg';
import ScanBarcodeIcon from '@/assets/svg/scan-barcode.svg';
import SmsIcon from '@/assets/svg/sms.svg';
import TickCircleGreenIcon from '@/assets/svg/tick-circle-green.svg';
import WalletAddIcon from '@/assets/svg/wallet-add.svg';

export default function SharePaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const order = useOrderStore((s) => s.order);
  const clearOrder = useOrderStore((s) => s.clearOrder);
  const clearCountry = useCountrySelectionStore((s) => s.clear);

  const [showWASuccess, setShowWASuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Realtime WS — auto navigates to /success on completion
  usePaymentStatus(id);

  const webUrl = order?.web_url ?? '';
  const { shareWhatsApp, shareNative } = useShareLinks({ webUrl });

  const amountLabel = (() => {
    if (order == null || order.fiat_amount == null) return '';
    const fiatKey = (order.fiat?.toLowerCase() ?? 'eur') as FiatKey;
    return formatAmountWithSymbol(String(order.fiat_amount), fiatKey);
  })();

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToastMessage(message);
      setToastType(type);
      setToastVisible(true);
    },
    []
  );

  const handleCopyUrl = useCallback(async () => {
    await Clipboard.setStringAsync(webUrl);
    showToast('Enlace copiado al portapapeles');
  }, [webUrl, showToast]);

  const handleWhatsAppSend = useCallback(
    (countryCode: string, phone: string) => {
      shareWhatsApp(countryCode, phone);
      setShowWASuccess(true);
    },
    [shareWhatsApp]
  );

  const handleNewRequest = useCallback(() => {
    setShowWASuccess(false);
    clearOrder();
    clearCountry();
    router.replace('/');
  }, [clearOrder, clearCountry]);

  return (
    <>
      <ScreenContainer
        scrollable
        edges={['top', 'bottom']}
        stickyFooter={
          <Button
            label="Nueva solicitud"
            variant="ghost"
            onPress={handleNewRequest}
            fullWidth
            rightIcon={<WalletAddIcon width={20} height={20} />}
          />
        }
      >
        <View style={styles.content}>
          {/* Summary card */}
          {order && (
            <PaymentSummaryCard
              amount={amountLabel}
              subtitle="Comparte el enlace de pago con el cliente"
            />
          )}

          {/* Share rows */}
          <View style={styles.rows}>
            {/* URL row */}
            <ShareRow
              icon={<LinkIcon width={24} height={24} />}
              label={webUrl}
              onPress={handleCopyUrl}
              trailing={
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => router.push(`/qr/${id}`)}
                  activeOpacity={0.7}
                  hitSlop={4}
                >
                  <ScanBarcodeIcon width={22} height={22} />
                </TouchableOpacity>
              }
            />

            {/* Email row */}
            <ShareRow
              icon={<SmsIcon width={24} height={24} />}
              label="Enviar por email"
              onPress={shareNative}
            />

            {/* WhatsApp inline row */}
            <WhatsAppShareRow onSend={handleWhatsAppSend} />

            {/* Other apps row */}
            <ShareRow
              icon={<ExportIcon width={24} height={24} />}
              label="Compartir con otras aplicaciones"
              onPress={shareNative}
            />
          </View>
        </View>
      </ScreenContainer>

      {/* WhatsApp success modal */}
      <Modal
        visible={showWASuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWASuccess(false)}
      >
        <BlurView
          intensity={50}
          tint="dark"
          style={[styles.modalOverlay, { paddingBottom: insets.bottom + theme.spacing.xl }]}
        >
          <View style={styles.blurColorOverlay} pointerEvents="none" />
          <View style={styles.modalCard}>
            <TickCircleGreenIcon width={72} height={72} style={styles.checkCircle} />
            <Typography variant="h2" align="center" style={styles.modalTitle}>
              Solicitud enviada
            </Typography>
            <Typography
              variant="body"
              align="center"
              color={theme.colors.textSecondary}
              style={styles.modalBody}
            >
              Tu solicitud de pago ha sido enviada con éxito por WhatsApp.
            </Typography>
            <Button label="Entendido" onPress={handleNewRequest} fullWidth />
          </View>
        </BlurView>
      </Modal>

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
  content: {
    flex: 1,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.xl,
  } as ViewStyle,
  rows: {
    gap: theme.spacing.md,
  } as ViewStyle,
  qrButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.xl,
    // paddingBottom is applied dynamically (insets.bottom + xl) so the
    // modal card clears the Android navigation bar on edge-to-edge builds.
  } as ViewStyle,
  blurColorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 214, 235, 0.10)',
  } as ViewStyle,
  modalCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.modal,
  } as ViewStyle,
  checkCircle: {
    marginBottom: theme.spacing.sm,
  } as ViewStyle,
  modalTitle: {
    marginBottom: theme.spacing.xs,
  } as TextStyle,
  modalBody: {
    marginBottom: theme.spacing.md,
  } as TextStyle,
});
