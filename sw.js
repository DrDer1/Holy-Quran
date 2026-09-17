const CACHE_NAME = 'quran-v6.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './quran.js',
    './quran.json',
    './manifest.json',
    './192.png',
    './512.png',
    './KFGQPC Uthmanic Script HAFS Regular.otf'
];

// ===== تثبيت Service Worker =====
self.addEventListener('install', (event) => {
    console.log('[SW] جارٍ التثبيت...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] تخزين الملفات الأساسية...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] تم تثبيت التطبيق بنجاح');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] فشل التثبيت:', error);
            })
    );
});

// ===== تفعيل Service Worker =====
self.addEventListener('activate', (event) => {
    console.log('[SW] جارٍ التفعيل...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] حذف الكاش القديم:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] تم تفعيل Service Worker');
                return self.clients.claim();
            })
    );
});

// ===== استراتيجية الجلب الذكية =====
self.addEventListener('fetch', (event) => {
    // تجاهل الطلبات غير GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // تجاهل طلبات Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    // استراتيجية خاصة لـ quran.json (Cache First مع تحديث خلفي)
    if (event.request.url.includes('quran.json')) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        // تحديث في الخلفية
                        fetch(event.request)
                            .then((response) => {
                                if (response && response.ok) {
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
                    
                    // إذا لم يكن موجوداً، جلبه من الشبكة
                    return fetch(event.request)
                        .then((response) => {
                            if (!response || response.status !== 200) {
                                return response;
                            }
                            
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                            
                            return response;
                        })
                        .catch((error) => {
                            console.error('[SW] فشل جلب quran.json:', error);
                            throw error;
                        });
                })
        );
        return;
    }
    
    // استراتيجية عامة: Cache First مع تحديث في الخلفية
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // تحديث الكاش في الخلفية
                    fetch(event.request)
                        .then((response) => {
                            if (response && response.ok && response.type === 'basic') {
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
                        // تحقق من صحة الاستجابة
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // استثناء: لا تخزن الطلبات من نطاقات أخرى
                        const url = new URL(event.request.url);
                        if (url.origin !== self.location.origin) {
                            return response;
                        }
                        
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] فشل الجلب:', event.request.url, error);
                        
                        // إذا فشل الاتصال، إرجاع الصفحة الرئيسية للتنقل
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        
                        // إرجاع أيقونة بديلة للصور
                        if (event.request.destination === 'image') {
                            return caches.match('./192.png');
                        }
                        
                        throw error;
                    });
            })
    );
});

// ===== التعامل مع الرسائل من التطبيق =====
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            console.log('[SW] تم مسح جميع الكاشات');
            if (event.ports && event.ports[0]) {
                event.ports[0].postMessage({ success: true });
            }
        });
    }
});

// ===== المزامنة في الخلفية =====
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-quran-data') {
        event.waitUntil(syncQuranData());
    }
});

// ===== دالة مزامنة بيانات القرآن =====
async function syncQuranData() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch('./quran.json');
        
        if (response.ok) {
            await cache.put('./quran.json', response);
            console.log('[SW] تم تحديث بيانات القرآن');
        }
    } catch (error) {
        console.error('[SW] فشل تحديث البيانات:', error);
    }
}

// ===== إشعارات Push (اختياري) =====
self.addEventListener('push', (event) => {
    const options = {
        body: 'تذكير بقراءة القرآن الكريم',
        icon: './192.png',
        badge: './192.png',
        dir: 'rtl',
        lang: 'ar',
        vibrate: [100, 50, 100]
    };
    
    event.waitUntil(
        self.registration.showNotification('المصحف الكريم', options)
    );
});

// ===== النقر على الإشعار =====
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                if (clients.openWindow) {
                    return clients.openWindow('./');
                }
            })
    );
});
