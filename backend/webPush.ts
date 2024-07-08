import webpush from 'web-push';

// Configurez webpush avec les clés VAPID
const publicKey = 'BDIxuoCRf2u7WzzouHEqq1Q7xGBvuLuLncXDy2VbQegmBA23NGqg7Wo4FMrEsRjw8icJpQ7KWnH08OJRGjJkEpQ';
const privateKey = 'ArWrjpu79gpnOrWpmUexdnGyo080bOgZREkJcjmfeB4';
const email = 'mailto:mattheo.valcke@gmail.com';

webpush.setVapidDetails(email, publicKey, privateKey);

// Convertir la clé publique VAPID en Uint8Array
function urlBase64ToUint8Array(base64String: String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Convertir la clé publique VAPID en Uint8Array
const applicationServerKey = urlBase64ToUint8Array(publicKey);

// Exportez les fonctions nécessaires
export { webpush, applicationServerKey, urlBase64ToUint8Array };
