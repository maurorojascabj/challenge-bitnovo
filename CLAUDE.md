# Bitnovo Pay — Project Reference

Testnet payment-gateway demo built with Expo SDK 54 + RN 0.81 + React 19.
Typed API/WS layers, atomic UI, Reanimated 4 animations, tokenized StyleSheet theme.
Before writing any code, read the exact versioned docs: https://docs.expo.dev/versions/v54.0.0/

---

## Quick start

```bash
npm install
npm run ios       # iOS Simulator
npm run android   # Android emulator
npm run web       # Expo web
```

Checks (must all pass before committing):

```bash
npm run lint
npm run format:check
npx tsc --noEmit
```

---

## Tech stack

| Layer | Library | Version |
|---|---|---|
| Runtime | Expo SDK | ~54.0.33 |
| RN / React | react-native / react | 0.81.5 / 19.1.0 |
| Routing | expo-router (typed routes, new arch) | ~6.0.23 |
| State | zustand | ^5 |
| HTTP | axios | ^1.16 |
| Forms | react-hook-form + zod v4 + @hookform/resolvers | — |
| Animation | react-native-reanimated 4 + react-native-worklets | ~4.1.1 |
| SVG | react-native-svg + react-native-svg-transformer | 15.12.1 |
| Mask input | react-native-mask-input | ^1.2.3 |
| QR | react-native-qrcode-svg | ^6.3.21 |
| Sharing | expo-sharing, expo-linking, expo-clipboard, expo-haptics | — |

---

## Architecture decisions

| Decision | Choice | Why |
|---|---|---|
| Styles | StyleSheet + typed `theme` module | Strong typing, zero build-config surface, Reanimated 4 worklet-safe, perf |
| State | Zustand v5 (slice-per-concern) | Selector subscriptions, zero boilerplate, no Provider tree |
| Fiat picker | Full-screen route (`selectors/fiat`) | No `<Modal>-inside-route` friction; uses `router.canGoBack()` guard; reuses `HeaderBar` + `ScreenContainer` |
| Country picker | `SelectorModal` bottom-sheet | WhatsApp-only flow; SVG flags already in project; modal presentation suits one-off selection |
| Device ID | Centralized `X-Device-Id` header | Single source in axios interceptor + WS URL, sourced from `EXPO_PUBLIC_DEVICE_ID` |
| Safe area | `SafeAreaProvider` at root + `edges` per layer | Provider in `_layout.tsx`; `HeaderBar` uses `edges={['top']}`, `ScreenContainer` uses `edges={['bottom']}` — no double-wrapping |
| Header layout | `absoluteFillObject` center + flex sides | Title spans full row width; side buttons never squeeze the center; `pointerEvents="none"` lets taps reach side elements |

---

## Folder structure

```
app/                         # expo-router file-based routes
  _layout.tsx                # Root Stack, GestureHandlerRootView, SplashScreen guard
  index.tsx                  # CreatePayment screen (RHF form)
  share/[id].tsx             # SharePayment screen (WS + 4 share options)
  qr/[id].tsx                # QR screen (WS subscription)
  success.tsx                # PaymentSuccess screen (AnimatedSuccess)
  selectors/
    fiat.tsx                 # Full-screen fiat selector (slide_from_right push, not modal)
    country.tsx              # Full-screen country selector (modal bottom-sheet)

src/
  components/
    atoms/                   # Single-element: Button, Typography, Loader, Divider
      index.ts               # barrel
    molecules/               # Small compositions: AmountInput, ConceptInput, SelectorRow, ShareOption, QRCard
      index.ts
    organisms/               # Stateful multi-element: SelectorModal, WhatsAppModal, Toast, AnimatedSuccess
      index.ts
    templates/               # Screen scaffolds: ScreenContainer, HeaderBar
      index.ts
    index.ts                 # Re-exports all layers
  constants/
    config.ts                # Reads EXPO_PUBLIC_* with fallback defaults
    currencies.ts            # FIAT_CURRENCIES, FIAT_CURRENCY_LIST, getCurrencyByCode
    countries.ts             # COUNTRIES, COUNTRY_LIST (8 entries)
    index.ts
  features/
    payments/
      api/paymentsApi.ts     # createPayment (multipart), getPayment
      hooks/
        useCreatePayment.ts  # Calls API, stores order, returns identifier
        usePaymentStatus.ts  # WS subscription, auto-navigates on completion
        useShareLinks.ts     # shareWhatsApp, shareEmail, shareNative
        index.ts
      schemas/
        createPayment.schema.ts  # Zod v4 schema for form validation
      ws/paymentSocket.ts    # subscribeToOrder() wrapping generic WebSocketClient
      types.ts               # Order, OrderStatus, AppError, COMPLETED_STATUSES, TERMINAL_STATUSES
  hooks/
    useDebounce.ts
    index.ts
  services/
    http/
      axiosClient.ts         # axios instance + X-Device-Id interceptor + FormData Content-Type strip
      errorNormalizer.ts     # Maps HTTP/network/timeout errors to AppError
      index.ts
    websocket/
      WebSocketClient.ts     # Generic WebSocketClient<TEvent>, exponential backoff, lifecycle states
      index.ts
  store/
    usePaymentStore.ts       # draft: { amount, fiatKey, concept, currencyTouched }, resetDraft
    useOrderStore.ts         # order: Order | null, setOrder, updateStatus, clearOrder
    useCountrySelectionStore.ts  # Transient one-shot for WhatsApp country selection
    index.ts
  theme/
    colors.ts                # primary[50-900] (500=#035AC5), neutral, semantic tokens (incl. buttonDisabledBg/Text)
    spacing.ts               # xxs:2 … huge:64
    radius.ts                # xs:4 … pill:999
    typography.ts            # display, h1-h3, body, small, caption + Semibold variants
    shadows.ts               # card, modal, button (Platform.select iOS/Android)
    index.ts                 # Composes all tokens into `theme`; exports `useTheme()`
  types/
    svg.d.ts                 # Ambient module declaration for *.svg imports
    index.ts
assets/
  svg/                       # All flag SVGs + Bitnovo-logo.svg (ASCII filenames only — see gotcha 1)
```

---

## Path aliases

Defined in `tsconfig.json` (`compilerOptions.paths`):

| Alias | Resolves to |
|---|---|
| `@/*` | `./*` (repo root) |
| `@/components/*` | `./src/components/*` |
| `@/features/*` | `./src/features/*` |
| `@/services/*` | `./src/services/*` |
| `@/store/*` | `./src/store/*` |
| `@/theme` | `./src/theme/index` |
| `@/theme/*` | `./src/theme/*` |
| `@/constants/*` | `./src/constants/*` |
| `@/hooks/*` | `./src/hooks/*` |
| `@/utils/*` | `./src/utils/*` |
| `@/types/*` | `./src/types/*` |
| `@/assets/*` | `./assets/*` |

---

## Environment variables

Three vars in `.env` (committed with testnet defaults — safe for a demo):

```
EXPO_PUBLIC_API_URL=https://payments.pre-bnvo.com/api/v1
EXPO_PUBLIC_WS_URL=wss://payments.pre-bnvo.com/ws/merchant
EXPO_PUBLIC_DEVICE_ID=d497719b-905f-4a41-8dbe-cf124c442f42
```

- Read by `src/constants/config.ts` (with hardcoded fallbacks so a fresh clone works).
- Surfaced in `app.config.ts` via `extra: { ... }` and `process.env.EXPO_PUBLIC_*`.

---

## Theme system

```ts
import { theme } from '@/theme';

// Usage
backgroundColor: theme.colors.primary[500]  // #035AC5
padding: theme.spacing.xl                   // 24
borderRadius: theme.radius.md               // 12
...theme.shadows.card
```

- `useTheme()` hook exported from `src/theme/index.ts` — reserved for future dark-mode swap; currently returns the static `theme` object.
- **To add a token:** edit the relevant `src/theme/*.ts` file, keep `as const`, update the exported `Type` if needed. Types propagate automatically to every consumer.
- Button disabled state uses `theme.colors.buttonDisabledBg` (`#EAF3FF`) and `theme.colors.buttonDisabledText` (`#71B0FD`) — spec-exact values, not neutral grays.

---

## Atomic Design boundaries

| Layer | Role | Examples |
|---|---|---|
| atoms | Single-element, no state | `Button`, `Typography`, `Loader`, `Divider` |
| molecules | Small composition, single purpose | `AmountInput`, `ConceptInput`, `SelectorRow`, `ShareOption`, `QRCard` |
| organisms | Multi-element, often stateful or animated | `SelectorModal`, `WhatsAppModal`, `Toast`, `AnimatedSuccess` |
| templates | Screen scaffold, layout only | `ScreenContainer`, `HeaderBar` |

Conventions for every component:
- `React.memo` + named function (not arrow) for stack traces.
- Typed props interface, no `any`.
- `StyleSheet.create<{ key: ViewStyle | TextStyle | ImageStyle }>({})` — explicit type param to avoid union errors.
- No inline style objects.

---

## Recipes

### Add a new screen

1. Create `app/<route>.tsx` (dynamic: `app/<segment>/[param].tsx`).
2. Register in `app/_layout.tsx` if it needs modal presentation, custom header, or animation.
3. Wrap content in `<ScreenContainer>` and use `<HeaderBar>`.
4. Navigate with `router.push('/route')` or `router.replace('/route')` — typed routes are on.

### Add an atomic component

1. Pick the correct layer (atoms / molecules / organisms / templates).
2. File name = PascalCase component name.
3. Export through the layer's barrel `index.ts` and through `src/components/index.ts`.
4. `React.memo`, typed props, `StyleSheet.create<{...}>({})`.

### Add a new API endpoint

1. Append the function to `src/features/<feature>/api/<feature>Api.ts`.
2. Define request/response types in `src/features/<feature>/types.ts`.
3. Use `axiosClient` — interceptors inject `X-Device-Id` and normalize errors automatically.
4. For multipart (file uploads): pass a `FormData` instance; **do not** set `Content-Type` manually (axios sets the boundary — see gotcha 6).

### Subscribe to a new WebSocket event

1. Extend the Zod schema in `src/features/<feature>/ws/*Socket.ts`.
2. Map the parsed frame to a domain type returned by `onStatus`.
3. Consume via a hook (e.g. `usePaymentStatus`) — the generic `WebSocketClient` handles reconnect with exponential backoff (1 s → 30 s, 5 retries).

### Add a form

1. Define a Zod schema in `src/features/<feature>/schemas/`.
2. `useForm<T>({ resolver: zodResolver(schema) })` with strict generic.
3. Render controlled inputs with `<Controller>` — RHF is the single source of truth for field values.
4. **Do not put store-managed fields into the schema.** If a value lives in Zustand (e.g. `fiatKey`), read it from the store at submit time instead of adding it to the form. Duplication causes silent desync (see gotcha 14).

### Add a full-screen selector route

1. Create `app/selectors/<name>.tsx` with `<HeaderBar title="..." showBack />` + `<ScreenContainer padded={false}>`.
2. Add a `<Stack.Screen name="selectors/<name>" />` to `app/_layout.tsx` — use default `slide_from_right` (not `modal`) so `router.canGoBack()` works reliably.
3. On selection: write to the relevant store slice, then `router.back()`.
4. Navigate to it via `router.push('/selectors/<name>')` — use a header chip or `TouchableOpacity` in `rightElement`.

### Add an SVG asset

1. Drop the file in `assets/svg/` — **ASCII filename only** (see gotcha 1).
2. Import as a React component: `import Icon from '@/assets/svg/foo.svg'`.
3. Render as `<Icon width={24} height={24} />`. Ambient declaration lives in `src/types/svg.d.ts`.

---

## Known gotchas

1. **Non-ASCII SVG filenames crash `svg-parser`.** Metro fails with "Unexpected end of input (0:0)". `españa.svg` → renamed to `espana.svg`. Rule: only lowercase ASCII + hyphens in `assets/svg/`.

2. **`babel-preset-expo` must be in `dependencies`** (not just `devDependencies`) when you use a custom `babel.config.js`. Without it Metro throws "Cannot find module 'babel-preset-expo'" at bundle time.

3. **`react-native-reanimated/plugin` must be the last entry** in the `plugins` array of `babel.config.js`. Placing it earlier causes silent worklet compilation failures.

4. **`SafeAreaView` from `react-native` is deprecated in new arch.** Always import from `react-native-safe-area-context`. Mixing the two sources causes layout bugs on notched devices.

5. **Zod v4 dropped `required_error` from enum options.** Use `z.enum([...], { error: 'message' })` or `.min(1, 'message')` on string. The old `{ required_error: '...' }` signature causes a TypeScript error.

6. **Axios + FormData: never set `Content-Type` manually.** axios must generate the `multipart/form-data; boundary=...` value itself. Our request interceptor in `axiosClient.ts` strips any manually set `Content-Type` when the body is a `FormData` instance.

7. **RN `WebSocket` constructor does not accept custom headers.** The `X-Device-Id` header is passed via the HTTP upgrade path by the `WebSocketClient` wrapper. See `src/services/websocket/WebSocketClient.ts` for the workaround and constraints.

8. **Order completion statuses are `CO` and `OC`, not `COMPLETED`.** See `COMPLETED_STATUSES` in `src/features/payments/types.ts`. Verify against the Bitnovo merchant dashboard before changing.

9. **`app.config.ts` and `app.json` are mutually exclusive.** The project uses `app.config.ts` exclusively. If `app.json` is present, Expo ignores `app.config.ts` and the env-var injection breaks.

10. **Two Metro instances on the same port** is the most common cause of "A dev server is already running on port 8081". Fix: `lsof -ti:8081 | xargs kill -9`, or start with `--port 8082`.

11. **`router.back()` without a guard silently no-ops on an empty stack.** Always call `router.canGoBack()` first; fall back to `router.replace('/')`. `HeaderBar` already implements this pattern — do not bypass it.

12. **Long header titles wrap when the center is a flex child.** `HeaderBar` places the title in a `StyleSheet.absoluteFillObject` view with `pointerEvents="none"`, so the title spans the full row width regardless of side-button widths. Never convert the center slot back to a flex child — it will squeeze long titles like "Selecciona una divisa".

13. **`SafeAreaProvider` must be the outermost wrapper in `_layout.tsx`.** Without it, `useSafeAreaInsets` and `SafeAreaView edges` fall back to zero insets and the header overlaps the notch. `HeaderBar` handles `edges={['top']}` and `ScreenContainer` handles `edges={['bottom']}` — no other screen needs an additional `SafeAreaView`.

14. **Do not duplicate store state inside RHF.** The `fiat` field was previously in both the schema and `usePaymentStore`, causing silent desync. If a value is managed by a Zustand slice, read it from the store at submit time — keep it out of the form schema entirely.

---

## External references

- Expo SDK 54 docs (read before coding): https://docs.expo.dev/versions/v54.0.0/
- Bitnovo Pay TESTNET API: `https://payments.pre-bnvo.com/api/v1`
- Bitnovo Pay TESTNET WS: `wss://payments.pre-bnvo.com/ws/merchant/{identifier}/`
- Reanimated 4 worklets: https://docs.swmansion.com/react-native-reanimated/
- react-native-mask-input: https://github.com/CaioQuirinoMedeiros/react-native-mask-input

---

## Verification checklist

Run before every PR / after any significant change:

- [ ] `npm run lint` — 0 errors, 0 warnings
- [ ] `npm run format:check` — no diffs
- [ ] `npx tsc --noEmit` — 0 errors (strict mode)
- [ ] App launches on iOS Simulator with splash screen then CreatePayment screen
- [ ] Header title is "Crear pago" on first load; becomes "Importe a pagar" after selecting a different currency
- [ ] Header chip shows selected currency code (`EUR ▼`) and navigates to full-screen fiat selector
- [ ] "Selecciona una divisa" title renders on one line with back arrow visible below the notch
- [ ] Searching a non-existent term shows "No se encontraron divisas" inline (no crash, no empty blank)
- [ ] Selected currency in the list shows a ✓ indicator
- [ ] Amount digits render in brand blue (`#035AC5`), cursor visible on Android
- [ ] Empty `Continuar` button has background `#EAF3FF` and text `#71B0FD`
- [ ] Entering an amount + concept enables the "Continuar" button (full brand blue)
- [ ] Tapping "Continuar" → SharePayment screen with correct amount displayed
- [ ] `← Volver` back navigation works from all screens; no crash on empty stack
- [ ] QR tab renders the QR code for the payment identifier
- [ ] Simulating a completed WS event navigates to PaymentSuccess with animation
- [ ] "Nueva Solicitud" resets draft and returns to `/` with title "Crear pago"
- [ ] Offline mode shows error Toast (not a crash)
- [ ] No Reanimated / new-arch warnings in Metro or device logs
