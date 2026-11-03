// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase with placeholders
// Note: You MUST update these values to match your Firebase project configuration
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || "Yangi bildirishnoma";
    const notificationOptions = {
        body: payload.notification?.body || "Sizda yangi xabar bor",
        icon: '/favicon.ico', // Update path to your logo if needed
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    let path = '/notifications';
    if (data.type === 'inactive_reminder') {
        path = '/dashboard';
    } else if (data.type === 'payment_success') {
        path = data.course_id ? `/courses/${data.course_id}` : '/premium';
    } else if (data.type === 'payment_failed') {
        path = '/premium';
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    client.focus();
                    if (client.navigate) client.navigate(path);
                    return;
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(path);
            }
        })
    );
});
