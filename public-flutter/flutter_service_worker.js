'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "734f2b74574eaafa499cef5f333f2f67",
"assets/AssetManifest.bin.json": "0629121ba7e424dd3f79e3f1b3ff8a19",
"assets/AssetManifest.json": "e478c81aa6183e1d5624e9125205141f",
"assets/assets/fonts/MetropolisBlack.ttf": "de55ae52af85b8952e65d1b546992618",
"assets/assets/fonts/MetropolisBold.ttf": "dea4998b081c6c1133a3b5b08ff2218c",
"assets/assets/fonts/MetropolisMedium.ttf": "f4bca87fd0d19e61c27dc96299c75f8c",
"assets/assets/fonts/MetropolisMediumItalic.ttf": "60eace1cb8db8096bcd15731bd3a35a3",
"assets/assets/fonts/MetropolisRegular.ttf": "f7b5e589f88206b4bd5cb1408c5362e6",
"assets/assets/fonts/MetropolisSemiBold.ttf": "2556a4f74e2c523893e6928d6e300f1c",
"assets/assets/images/Bhavans_logo.png": "70c0971402c6cfbbb8fe8983355db96f",
"assets/assets/images/Bhavans_logo_1.jpg": "384e51b903aff48660517f7401cee2b1",
"assets/assets/images/Daily_Update.jpg": "92b4e3ed3942dd52c2d3c55b1a6297c3",
"assets/assets/images/Daily_Update_V2.png": "a7973b89a4277e1485fe7efbd8e0e590",
"assets/assets/images/image_not_found.png": "a88029aaad6e6ea7596096c7c451840b",
"assets/assets/images/img_341350527_11843.jpg": "eb7983559310cbaa421c485485171cd0",
"assets/assets/images/img_arrow_left.svg": "dacf16d9297165dac19b2728dd8766f5",
"assets/assets/images/img_bell_1.svg": "11621a207890d868d641acbd9bfd3d09",
"assets/assets/images/img_bhavan_s_1_04_1.png": "7fa662fa22d4dce86f135cbba7110d36",
"assets/assets/images/img_blue_high_rise_building.png": "f02b687984448d3c62218efe31be3060",
"assets/assets/images/img_blue_high_rise_building_467x130.png": "152498e4e3d5126cb79ec0f8d9e6c211",
"assets/assets/images/img_blue_isometric_skyscraper.png": "234b70d665bdb2ede3e17caa0b13a44f",
"assets/assets/images/img_bookmark.svg": "88df967ebe3eaa537736e13cd8870085",
"assets/assets/images/img_bookmark_white_a700.svg": "eed48e6d5ed0411fc920af728750a6d7",
"assets/assets/images/img_call.svg": "c54e33ba50d59450e414a2429186f71a",
"assets/assets/images/img_close.svg": "54de402ce22c7771cf9f3095c553e641",
"assets/assets/images/img_closeeye_1_1.png": "bf7cba2f016d531e5fd9d11aa4464ce8",
"assets/assets/images/img_close_gray_500_01.svg": "1446088ca69fd9efda99d264faa2633c",
"assets/assets/images/img_eye.svg": "6de98c620857c22eb348a40b1b067eee",
"assets/assets/images/img_favorite.svg": "0e021c6438f988d390ac19e057e51226",
"assets/assets/images/img_favorite_white_a700.svg": "a5008efdbe0583987bd5438e2ebacac5",
"assets/assets/images/img_grid.svg": "bb2ab0fbb5c369505184f50edd7e33ff",
"assets/assets/images/img_grid_white_a700.svg": "9fefd4381b86c0c5942cd916a9e1b3aa",
"assets/assets/images/img_image_1.png": "d9fcdd63ed281408a1d57b50339c7ac6",
"assets/assets/images/img_image_1_74x74.png": "631c13c62f7347a1d483e2daa6bf3410",
"assets/assets/images/img_image_2.png": "4568166844b203118e9f8bfd9b7973d5",
"assets/assets/images/img_image_2_117x117.png": "870fc976cb108e730d751b19569a8e38",
"assets/assets/images/img_image_3.png": "8f31667c0a8c7e7a1f1351e4298e6b94",
"assets/assets/images/img_image_4.png": "06a7270d126a0ba5f99b63d16c33308a",
"assets/assets/images/img_image_5.png": "03dfa2ab4fcfd84677d8323833913395",
"assets/assets/images/img_jay_resibliz_logo_07.png": "6e1a6cc95881889b5b0b5c62ba253ceb",
"assets/assets/images/img_location.svg": "068fee409dede71c05205ae007a57c83",
"assets/assets/images/img_lock.jpg": "6532380e787f20b4dc4647ef7bce43c1",
"assets/assets/images/img_lock_white_a700.svg": "20806e55588a94bede15e3943897675a",
"assets/assets/images/img_megaphone.svg": "e2528d85d50a5c3534d9972a532d54d2",
"assets/assets/images/img_nav_account.svg": "173a486ab9ff4c6dc597496a9fa0614c",
"assets/assets/images/img_nav_account_gray_900.svg": "5ef23488f6b07a3befc42fc6382d3b8e",
"assets/assets/images/img_nav_favorites.svg": "706ebdfbf9a674a12f169c2e1b46c500",
"assets/assets/images/img_nav_home.svg": "b7b0682eabd2fab0bcd3bfebe3757381",
"assets/assets/images/img_nav_home_gray_700.svg": "8e4e85d34320bd5cb6e93e3c9a36541b",
"assets/assets/images/img_nav_search.svg": "e06b5373a8e4aa1cb4c1d0c069dadfa4",
"assets/assets/images/img_rectangle_18.png": "2872f89aad546a6e722f3d826db039a4",
"assets/assets/images/img_search.svg": "de117244f5c25df93ea72f829b87d326",
"assets/assets/images/img_settings.svg": "56eaeaf1f200c258767708cabc4f0d60",
"assets/assets/images/img_television.svg": "d63437c39ee0672843fc6cc585db02aa",
"assets/assets/images/img_user.svg": "be2033432531e7c9b98174cf96f6efff",
"assets/assets/images/img_user_gray_900.svg": "7e5a056dcdbf8941e9f9c7a78a90f739",
"assets/assets/images/Project_Images.jpg": "aa06b734a488f7756b8b28da90369d73",
"assets/assets/images/Project_Images_V2.png": "d7ad74900390e82f518a9e2d817caa49",
"assets/assets/images/user.png": "4b49a3dc1a38a680b4bff366f9b6d1d9",
"assets/FontManifest.json": "135422d3d3e23805e6887670a34128c6",
"assets/fonts/MaterialIcons-Regular.otf": "e87732c4b3bfa36033a2a0b856ba9691",
"assets/NOTICES": "6b18357d89de95df5953cd42834a8f00",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/packages/fluttertoast/assets/toastify.css": "910ddaaf9712a0b0392cf7975a3b7fb5",
"assets/packages/fluttertoast/assets/toastify.js": "18cfdd77033aa55d215e8a78c090ba89",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "17ee8e30dde24e349e70ffcdc0073fb0",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "4ad08ad6470334874d35e2d51586b3e5",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "a3a24236b200db250251ab04529164b5",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "c86fbd9e7b17accae76e5ad116583dc4",
"canvaskit/canvaskit.js.symbols": "38cba9233b92472a36ff011dc21c2c9f",
"canvaskit/canvaskit.wasm": "3d2a2d663e8c5111ac61a46367f751ac",
"canvaskit/chromium/canvaskit.js": "43787ac5098c648979c27c13c6f804c3",
"canvaskit/chromium/canvaskit.js.symbols": "4525682ef039faeb11f24f37436dca06",
"canvaskit/chromium/canvaskit.wasm": "f5934e694f12929ed56a671617acd254",
"canvaskit/skwasm.js": "445e9e400085faead4493be2224d95aa",
"canvaskit/skwasm.js.symbols": "741d50ffba71f89345996b0aa8426af8",
"canvaskit/skwasm.wasm": "e42815763c5d05bba43f9d0337fa7d84",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "c71a09214cb6f5f8996a531350400a9a",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "3fc86d6d7b66c562f33cac573db009d5",
"/": "3fc86d6d7b66c562f33cac573db009d5",
"main.dart.js": "76820f29534a0f2f2c6146ff415f76ca",
"manifest.json": "4f913b7624f6fb42ddaa7c6725f9258a",
"version.json": "882b22ddb4024c7e4fb2de6476f82e91"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
