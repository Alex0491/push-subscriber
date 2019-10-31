// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
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
  // This will be called only once when the service worker is activated.
  console.log('service worker activate')
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BB1k6GlIrrB0TiO6WFbQFYZkNIdfOBzQN4yHa0xGvrhhBdqFhoibHxD_rGdUsFcc0p3UFfYf8kS-peymtBUc6M4'
    )
    const options = { applicationServerKey, userVisibleOnly: true }
    const subscription = await self.registration.pushManager.subscribe(options)

    var body = JSON.stringify(subscription)
    console.log(body)

    const resp = await fetch('http://localhost:6601/save', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    })

    console.log(resp.statusText)
    
    
  } catch (err) {
    console.log('Error', err)
  }
})

self.addEventListener('push', function(event) {
  if (event.data != null) {
    console.log('Push event!! ', event.data.text())
  } else {
    console.log('Push event but no data')
  }

  const title = 'Test Webpush';
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(self.registration.showNotification(title, options));
})