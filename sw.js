self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('restaurant-reviews-v1').then(function(cache) {
            return cache.addAll([
                '/',
                'css/responsive.css',
                'css/styles.css',
                'data/restaurants.json',
                'js/dbhelper.js',
                'js/main.js',
                'js/restaurant_info.js',
                'index.html',
                'restaurant.html',
                'img/1.jpg',
                'img/2.jpg',
                'img/3.jpg',
                'img/4.jpg',
                'img/5.jpg',
                'img/6.jpg',
                'img/7.jpg',
                'img/8.jpg',
                'img/9.jpg',
                'img/10.jpg',
                'img/responsive/360w/1.jpg',
                'img/responsive/360w/2.jpg',
                'img/responsive/360w/3.jpg',
                'img/responsive/360w/4.jpg',
                'img/responsive/360w/5.jpg',
                'img/responsive/360w/6.jpg',
                'img/responsive/360w/7.jpg',
                'img/responsive/360w/8.jpg',
                'img/responsive/360w/9.jpg',
                'img/responsive/360w/10.jpg',
                'img/responsive/480w/1.jpg',
                'img/responsive/480w/2.jpg',
                'img/responsive/480w/3.jpg',
                'img/responsive/480w/4.jpg',
                'img/responsive/480w/5.jpg',
                'img/responsive/480w/6.jpg',
                'img/responsive/480w/7.jpg',
                'img/responsive/480w/8.jpg',
                'img/responsive/480w/9.jpg',
                'img/responsive/480w/10.jpg',
                'img/responsive/800w/1.jpg',
                'img/responsive/800w/2.jpg',
                'img/responsive/800w/3.jpg',
                'img/responsive/800w/4.jpg',
                'img/responsive/800w/5.jpg',
                'img/responsive/800w/6.jpg',
                'img/responsive/800w/7.jpg',
                'img/responsive/800w/8.jpg',
                'img/responsive/800w/9.jpg',
                'img/responsive/800w/10.jpg',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});