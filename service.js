// urlB64ToUint8Array is a magic function that will encode the base64 public key
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

self.addEventListener('activate', async () => {
  console.log('service worker activate')
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BHQvI_SG5HT4Hd2QQux7uaOU72CyjtSvfTdccZ2RXmMRCW-fWwLMN2ko7zi-P5MSyYpka1JLA-4qFzZ-VvKa5Ss'
    )    
    const options = { applicationServerKey, userVisibleOnly: true }
    const subscription = await self.registration.pushManager.subscribe(options)

    const subscriptionJson = JSON.stringify(subscription)
    console.log("subscription: ", subscriptionJson)

    await fetch('http://localhost:6601/save', {
      method: 'post',
      mode: "no-cors",
      cache: "no-cache",
      headers: {
        'Content-Type': 'application/json',
      },
      body: subscriptionJson,
    }).then(
      (resp) => {console.log(resp.statusText)}, 
      (reason) => {console.log(reason)}
    )

  } catch (err) {
    console.log('Error', err)
  }
})

self.addEventListener('push', function(event) {
  console.log('received push')
  console.log('push: ', event.data ? event.data.text() : "null")

  try {
    const pushData = event.data.json()

    console.log('1', pushData.options);

    const title = pushData.title
    const options = pushData.options ? JSON.parse(pushData.options) : {};

    event.waitUntil(self.registration.showNotification(title, options));
  } catch(err) {
    console.log('Error', err)
  }
})

self.addEventListener('notificationclick', function(event) {
  if (event.notification.data.url) {
    let navigationUrl = event.notification.data.url;

    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clients => clients.filter(client => client.url === originalUrl))
        .then(matchingClients => {
          if (matchingClients[0]) {
            return matchingClients[0].navigate(navigationUrl).then(client => client.focus());
          }
          return clients.openWindow(navigationUrl);
        })
    );
  }
})