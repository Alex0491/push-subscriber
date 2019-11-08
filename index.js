const checkPushesSupporting = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register('/service.js')
}

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification')
  }
}

const subscribe = async () => {
  console.log("click subscribe")
  checkPushesSupporting()
  
  await requestNotificationPermission()
  await registerServiceWorker()
}

const testNotify = async () => {
  await navigator.serviceWorker.getRegistration().then(reg => {
    reg.showNotification('test notification', {
      body:  'body here',
      icon:  '/icon.png',
      image: '/image.png'
    })
  })
}