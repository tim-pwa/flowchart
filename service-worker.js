// Service Worker 版本
const CACHE_NAME = 'logic-form-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
    '/flowchart/',
    '/flowchart/index.html',
    '/flowchart/styles.css',
    '/flowchart/app.js',
    '/flowchart/manifest.json',
    '/flowchart/icon-192.png',
    '/flowchart/icon-512.png'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
    console.log('Service Worker: 安装中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: 缓存静态资源');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => self.skipWaiting()) // 立即激活新的 Service Worker
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('Service Worker: 激活中...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('Service Worker: 删除旧缓存', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 立即控制所有页面
    );
});

// 获取事件 - 网络优先，回退到缓存
self.addEventListener('fetch', (event) => {
    // 跳过非 GET 请求
    if (event.request.method !== 'GET') {
        return;
    }

    // 跳过 chrome-extension 和其他协议
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 如果有缓存，先返回缓存
                if (cachedResponse) {
                    // 同时在后台更新缓存
                    fetch(event.request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                const responseToCache = response.clone();
                                caches.open(RUNTIME_CACHE)
                                    .then((cache) => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                        })
                        .catch(() => {
                            // 网络请求失败，使用缓存
                        });
                    return cachedResponse;
                }

                // 没有缓存，尝试网络请求
                return fetch(event.request)
                    .then((response) => {
                        // 检查响应是否有效
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // 克隆响应以缓存
                        const responseToCache = response.clone();
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // 网络请求失败，返回离线页面（如果有）
                        if (event.request.destination === 'document') {
                            return caches.match('/flowchart/index.html');
                        }
                    });
            })
    );
});

// 后台同步（如果浏览器支持）
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

function syncData() {
    // 这里可以实现数据同步逻辑
    return Promise.resolve();
}

// 推送通知（如果浏览器支持）
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '您有新的通知',
        icon: '/flowchart/icon-192.png',
        badge: '/flowchart/icon-192.png',
        vibrate: [200, 100, 200],
    };

    event.waitUntil(
        self.registration.showNotification('逻辑表单', options)
    );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/flowchart/')
    );
});
