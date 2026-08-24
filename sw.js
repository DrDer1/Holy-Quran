// ============================================================
// SERVICE WORKER - لتشغيل التطبيق بدون إنترنت
// ============================================================

const CACHE_NAME = 'quran-cache-v1';
const ASSETS = [
    'index.html',
    'style.css',
    'app.js',
    'quran.js',
    'quran.json',
    'manifest.json',
    '192.png',
    '512.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل الـ Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد في الكاش، أرجع منه
                if (response) {
                    return response;
                }
                // وإلا، حاول من الشبكة
                return fetch(event.request)
                    .then(response => {
                        // إذا كان الاستجابة صالحة، خزنها في الكاش
                        if (response && response.status === 200) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, clone);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // إذا لم يكن هناك اتصال ولا كاش
                        return new Response('⚠️ لا يوجد اتصال بالإنترنت', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});
