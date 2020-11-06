var CACHE_NAME = "workbox-precache-v2-https://dev.rentalmoose.com/";
var urlsToCache = ["/"];
// let buttonInstall = document.querySelector("#install-button");
// console.log("buttonInstall", buttonInstall);

// let installPromptEvent;

// window.addEventListener("beforeinstallprompt", (event) => {
//   // Prevent Chrome <= 67 from automatically showing the prompt
//   event.preventDefault();
//   // Stash the event so it can be triggered later.
//   installPromptEvent = event;
//   // Update the install UI to notify the user app can be installed
//   document.querySelector("#install-button").disabled = false;
// });
// Install a service worker
self.addEventListener("install", (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// buttonInstall.addEventListener("click", () => {
//   // Update the install UI to remove the install button
//   document.querySelector("#install-button").disabled = true;
//   // Show the modal add to home screen dialog
//   installPromptEvent.prompt();
//   // Wait for the user to respond to the prompt
//   installPromptEvent.userChoice.then((choice) => {
//     if (choice.outcome === "accepted") {
//       console.log("User accepted the A2HS prompt");
//     } else {
//       console.log("User dismissed the A2HS prompt");
//     }
//     // Clear the saved prompt since it can't be used again
//     installPromptEvent = null;
//   });
// });
// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
