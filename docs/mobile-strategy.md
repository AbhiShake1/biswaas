# Biswaas Mobile Strategy

## Overview

Biswaas uses a multi-platform approach to reach users across web, desktop, and mobile. This document outlines the current strategy and future plans.

## Current Architecture

### Web Application (Primary)

- **Framework**: SvelteKit with SSR and client-side navigation
- **Hosting**: Vercel (serverless deployment)
- **Responsive**: Tailwind CSS breakpoints for mobile-first design

### Progressive Web App (PWA) — Mobile Web

The primary mobile experience is delivered via PWA:

- **Installable**: Users can add Biswaas to their home screen on iOS and Android
- **Offline support**: Service worker caches critical assets and review data
- **Push notifications**: Web Push API for review alerts (where supported)
- **Camera access**: For uploading review photos via `getUserMedia`

**PWA Advantages for Biswaas:**

- No app store approval process
- Instant updates (no version fragmentation)
- Single codebase serves both desktop and mobile browsers
- Lower development and maintenance cost

**PWA Limitations:**

- iOS Safari has limited background sync and push notification support
- No access to native contact list, NFC, or Bluetooth
- Cannot appear in App Store / Play Store search results (without TWA wrapper)

### Desktop Application — Tauri

Biswaas uses Tauri for native desktop builds:

- **Platforms**: macOS, Windows, Linux
- **Runtime**: System WebView (no bundled Chromium — small binary size)
- **Native features**: System tray, file system access, auto-update
- **Build**: `tauri build` produces platform-specific installers

**Why Tauri over Electron:**

- Significantly smaller bundle size (~5 MB vs ~150 MB)
- Lower memory footprint
- Rust-based backend for performance-critical operations
- Better security model (no Node.js in renderer)

## Future: Native Mobile (Capacitor)

Capacitor remains an option for native mobile apps if needed:

### When to Consider Capacitor

- App Store / Play Store presence is required for business reasons
- Features requiring deep native access (NFC payments, Bluetooth, background geolocation)
- Push notification reliability on iOS becomes critical
- Offline-first requirements exceed PWA capabilities

### Implementation Plan (If Activated)

```
biswaas/
  src-capacitor/
    android/          # Android Studio project
    ios/              # Xcode project
    capacitor.config.ts
```

**Key Capacitor plugins to evaluate:**

- `@capacitor/camera` — Photo capture for reviews
- `@capacitor/push-notifications` — Native push
- `@capacitor/filesystem` — Offline review storage
- `@capacitor/share` — Native share sheet for reviews
- `@capacitor/haptics` — Haptic feedback on star rating

**Migration path:**

1. Add Capacitor to existing SvelteKit project
2. Configure platform-specific builds (Android, iOS)
3. Replace Web API calls with Capacitor plugin equivalents where needed
4. Set up CI/CD for mobile builds (Fastlane or EAS Build)
5. Submit to App Store and Play Store

### Timeline Estimate

- **Phase 1** (2 weeks): Capacitor setup, basic build pipeline
- **Phase 2** (2 weeks): Native plugin integration (camera, push, share)
- **Phase 3** (1 week): App store submission and review

## Decision Matrix

| Feature             | PWA | Tauri Desktop | Capacitor (Future) |
| ------------------- | --- | ------------- | ------------------ |
| Home screen install | Yes | N/A           | Yes                |
| Push notifications  | Partial | N/A       | Full               |
| Offline support     | Yes | Yes           | Yes                |
| Camera access       | Yes | Limited       | Full               |
| File system         | Limited | Full      | Full               |
| App store presence  | No  | No            | Yes                |
| Auto-update         | Yes | Yes           | Via stores         |
| Bundle size         | 0   | ~5 MB         | ~10 MB             |

## Recommendation

**For 2026**: Continue with PWA as the mobile experience. The majority of Biswaas users access the platform through mobile browsers, and PWA provides sufficient functionality for review browsing, submission, and notifications.

**Revisit Capacitor** when any of these triggers occur:

- Monthly active users exceed 50,000 and app store discoverability becomes a growth lever
- A key feature requires native-only APIs
- iOS PWA limitations cause measurable user drop-off
