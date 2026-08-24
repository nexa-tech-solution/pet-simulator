// Compatibility worker for stale Firebase Messaging registrations in existing browsers.
// The app does not use Firebase messaging, so this worker intentionally has no handlers.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
