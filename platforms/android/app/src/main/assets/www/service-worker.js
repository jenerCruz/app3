// Este código representa el archivo service-worker.js o sw.js
// Las variables CRITICAL_ASSETS y MANIFEST_DATA se asume que han sido
// inyectadas en este script por tu proceso de construcción.

// EJEMPLO DE CÓMO SE INYECTARÍAN LAS VARIABLES:
// const CRITICAL_ASSETS = ['./styles/main.css', './scripts/main.js', 'https://code.jquery.com/jquery-3.7.1.min.js'];
// const MANIFEST_DATA = { /* ... contenido de tu manifest.json ... */ };


const CACHE_NAME = 'sales-app-v1';
// Estas variables contienen las URLs (incluyendo las librerías de CDN que quieres forzar a guardar)
const CRITICAL_ASSETS = ${JSON.stringify(CRITICAL_ASSETS)};
const MANIFEST_DATA = ${JSON.stringify(manifestData)};
const MANIFEST_URL = '/manifest.webmanifest';

// --- 1. Evento 'install' (Instalación y Precaching Forzado) ---
self.addEventListener('install', (event) => {
    // Activa el Service Worker inmediatamente
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Aquí se fuerza el guardado de todos los recursos listados,
                // incluyendo las librerías de CDN que están en CRITICAL_ASSETS.
                console.log('Service Worker: Forzando guardado de activos críticos y librerías.');
                return cache.addAll(['./', ...CRITICAL_ASSETS]);
            })
            .then(() => console.log('Service Worker: Caché de activos críticos guardada.'))
            .catch((error) => console.error('Service Worker: Fallo al cachear activos (posiblemente CDN no accesible):', error))
    );
});

// --- 2. Evento 'activate' (Limpieza y Toma de Control) ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Elimina todas las cachés que NO coincidan con el CACHE_NAME actual
            return Promise.all(
                cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            console.log('Service Worker: Cachés antiguas eliminadas. Nuevo SW activado.');
            // Asegura que el nuevo SW tome control de las pestañas activas inmediatamente
            return self.clients.claim();
