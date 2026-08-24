const CACHE_NAME = 'quran-v2.0.0';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/quran.js',
    '/quran.txt',
    '/manifest.json',
    '/192.png',
    '/512.png'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('تخزين الملفات...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('تم تثبيت التطبيق بنجاح');
                return self.skipWaiting();
            })
    );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('حذف الكاش القديم:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('تم تفعيل Service Worker');
                return self.clients.claim();
            })
    );
});

// استراتيجية التخزين: Cache First مع تحديث في الخلفية
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // تحديث الكاش في الخلفية
                    fetch(event.request)
                        .then((response) => {
                            if (response.ok) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseClone);
                                    });
                            }
                        })
                        .catch(() => {
                            // تجاهل أخطاء الشبكة
                        });
                    
                    return cachedResponse;
                }
                
                // إذا لم يكن الملف في الكاش، جلبه من الشبكة
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // إذا فشل الاتصال، إرجاع الصفحة الرئيسية
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});
