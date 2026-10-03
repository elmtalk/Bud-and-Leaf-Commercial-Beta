const CACHE_NAME='bud-leaf-pwa-0-10-32-rc2l-aug2026-v1';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icon-72.png','./icon-96.png','./icon-128.png','./icon-144.png','./icon-152.png','./icon-180.png','./icon-192.png','./icon-256.png','./icon-384.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(key=>key!==CACHE_NAME?caches.delete(key):null))));
  self.clients.claim();
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const request=event.request;
  event.respondWith((async()=>{
    const cached=await caches.match(request,{ignoreSearch:true});
    if(cached) return cached;
    try{
      const response=await fetch(request);
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)).catch(()=>{});
      return response;
    }catch(err){
      if(request.mode==='navigate' || (request.headers.get('accept')||'').includes('text/html')){
        const cache=await caches.open(CACHE_NAME);
        return (await cache.match('./index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
