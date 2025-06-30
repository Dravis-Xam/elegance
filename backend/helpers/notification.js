export const sendNotification = (socket, message) => {
    socket.emit('Notifications', {
      id: Date.now(),
      message: message,
      read: false,
      timestamp: new Date()
    })
}