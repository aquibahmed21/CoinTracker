const cacheName = 'v1';

const arr = [ 'index.html',
	'html/signin.html',
	'html/about.html',
	'/javascript/client-script/dashboard.js',
	'/javascript/client-script/constants.js',
	'/javascript/client-script/signin.js',
	'/javascript/client-script/websocket.js',
	'/res/images/about.png',
	'/res/images/account_smiley.png',
	'/res/images/chart.png',
	'/res/images/dashboard.png',
	'/res/images/edit.png',
	'/res/images/logout.png',
	'/res/images/profile.png',
	'/res/images/save.png',
	'/res/images/store.png',
	'/res/images/favicon.ico',
	'/styles/basic.css',
	'/styles/form.css',
	'/styles/nav.css',
	'/styles/notification.css',
	'/styles/PL.css',
	'/styles/preloader.css',
	'/styles/signin.css',
	'/styles/table.css',
	'/styles/util.css',
];

// Call install event
self.addEventListener( 'install', ( e ) =>
{
	console.log( 'Service Worker: Installed' );

	e.waitUntil(
		caches.open( cacheName ).then( ( cache ) =>
		{
			console.log( 'Service Worker: Caching Files' );
			cache.addAll( arr );
		} ).then( () => self.skipWaiting() )
	);
} );
// Call activate event
self.addEventListener( 'activate', ( e ) =>
{
	console.log( 'Service Worker: Activated' );
} );

self.addEventListener( 'fetch', ( e ) =>
{
	console.log( 'Service Worker: Fetching' );
	e.respondWith(
		fetch( e.request ).then( res =>
		{
			// make copy/clone of response
			const resClone = res.clone();
			// open cache
			caches.open( cacheName ).then( cache =>
			{
				// add or replace cache
				cache.put( e.request, resClone );
			}
			);
			return res;
		} ).catch( () => caches.match( e.request ).then( res => res ) ) );
} );