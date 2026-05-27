const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://payments.pre-bnvo.com/api/v1';
const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'wss://payments.pre-bnvo.com/ws/merchant/';
const DEVICE_ID = process.env.EXPO_PUBLIC_DEVICE_ID ?? 'd497719b-905f-4a41-8dbe-cf124c442f42';

export const config = {
  apiUrl: API_URL,
  wsUrl: WS_URL,
  deviceId: DEVICE_ID,
} as const;
