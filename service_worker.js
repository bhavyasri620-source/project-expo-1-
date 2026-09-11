// ============================================
// VEDA SAHAYAK
// OFFLINE SERVICE WORKER
// ============================================

const CACHE_NAME = "veda-sahayak-v3";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./manifest.json",

    "./service-worker.js",

    "./veda-hero.png"

];


self.addEventListener(
    "install",
    function(event) {

        console.log(
            "🌿 Veda Sahayak Service Worker installing..."
        );


        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    function(cache) {

                        console.log(
                            "📦 Caching Veda Sahayak files..."
                        );


                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );


        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    function(event) {

        console.log(
            "✅ Veda Sahayak Service Worker activated."
        );


        event.waitUntil(

            caches
                .keys()
                .then(
                    function(cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function(cacheName) {

                                    if (
                                        cacheName !== CACHE_NAME
                                    ) {

                                        console.log(
                                            "🗑️ Removing old cache:",
                                            cacheName
                                        );


                                        return caches.delete(
                                            cacheName
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches
                .match(event.request)
                .then(
                    function(cachedResponse) {

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        return fetch(
                            event.request
                        )

                        .then(
                            function(networkResponse) {

                                return caches
                                    .open(CACHE_NAME)
                                    .then(
                                        function(cache) {

                                            cache.put(
                                                event.request,
                                                networkResponse.clone()
                                            );


                                            return networkResponse;

                                        }
                                    );

                            }
                        )

                        .catch(
                            function() {

                                return new Response(

                                    `

                                    <!DOCTYPE html>

                                    <html>

                                    <head>

                                        <title>
                                            Veda Sahayak Offline
                                        </title>

                                        <meta
                                            name="viewport"
                                            content="width=device-width, initial-scale=1.0"
                                        >

                                        <style>

                                            body {

                                                font-family:
                                                    Arial,
                                                    sans-serif;

                                                background:
                                                    #eef5f0;

                                                text-align:
                                                    center;

                                                padding:
                                                    40px;

                                            }

                                            .box {

                                                background:
                                                    white;

                                                padding:
                                                    30px;

                                                border-radius:
                                                    20px;

                                                max-width:
                                                    500px;

                                                margin:
                                                    auto;

                                                box-shadow:
                                                    0 10px 30px rgba(0,0,0,0.1);

                                            }

                                        </style>

                                    </head>


                                    <body>

                                        <div class="box">

                                            <h1>
                                                🌿 Veda Sahayak
                                            </h1>

                                            <h2>
                                                You're Offline
                                            </h2>

                                            <p>
                                                The internet connection
                                                is currently unavailable.
                                            </p>

                                            <p>
                                                Please open the application
                                                again when the connection
                                                is restored.
                                            </p>

                                        </div>

                                    </body>

                                    </html>

                                    `,

                                    {

                                        headers: {

                                            "Content-Type":
                                                "text/html"

                                        }

                                    }

                                );

                            }
                        );

                    }
                )

        );

    }
);