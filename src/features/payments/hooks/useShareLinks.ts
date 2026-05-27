import { useCallback } from 'react';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

interface UseShareLinksOptions {
  webUrl: string;
}

interface UseShareLinksResult {
  shareWhatsApp: (countryCode: string, phone: string) => Promise<void>;
  shareEmail: () => Promise<void>;
  shareNative: () => Promise<void>;
}

export function useShareLinks({ webUrl }: UseShareLinksOptions): UseShareLinksResult {
  const shareWhatsApp = useCallback(
    async (countryCode: string, phone: string) => {
      // Strip leading zeros and non-digit chars from the phone number
      const cleanPhone = phone.replace(/\D/g, '');
      const cleanCode = countryCode.replace('+', '');
      const fullNumber = `${cleanCode}${cleanPhone}`;
      const text = encodeURIComponent(`Paga con Bitnovo: ${webUrl}`);
      const waUrl = `https://wa.me/${fullNumber}?text=${text}`;
      const canOpen = await Linking.canOpenURL(waUrl);
      if (canOpen) {
        await Linking.openURL(waUrl);
      }
    },
    [webUrl]
  );

  const shareEmail = useCallback(async () => {
    const subject = encodeURIComponent('Pago con Bitnovo');
    const body = encodeURIComponent(`Accede a tu pago aquí: ${webUrl}`);
    const mailUrl = `mailto:?subject=${subject}&body=${body}`;
    const canOpen = await Linking.canOpenURL(mailUrl);
    if (canOpen) {
      await Linking.openURL(mailUrl);
    }
  }, [webUrl]);

  const shareNative = useCallback(async () => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      // expo-sharing requires a local URI, so fall back to RN Share for URLs
    }
    await Share.share({
      message: `Paga con Bitnovo: ${webUrl}`,
      url: webUrl,
    });
  }, [webUrl]);

  return { shareWhatsApp, shareEmail, shareNative };
}
