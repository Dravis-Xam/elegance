// middlewares/notificationMiddleware.js
const notificationMiddleware = (io) => {
  return (req, res, next) => {
    req.notify = (type, metadata = {}) => {
      let message = '';

      switch (type) {
        case 'New product':
          message = `Check out our new product: ${metadata.createdProduct.name}!`;
          break;
        case 'Maintenance':
          message = `We are having a system maintenance on ${metadata.start.date} at ${metadata.start.time} for ${metadata.duration}. We apologize for any inconvenience.`;
          break;
        case 'Password change':
          message = `You have successfully changed your password.`;
          break;
        case 'Credentials change':
          message = `Your credentials have been updated successfully.`;
          break;
        case 'Profile photo':
          message = "You've uploaded your profile picture.";
          break;
        case 'Order update':
          message = JSON.stringify(metadata)
          break;
        default:
          return;
      }

      const payload = {
        id: Date.now(),
        type,            // Include the notification type
        message,
        metadata,        // Let frontend decide what to do with metadata
        read: false,
        timestamp: new Date()
      };

      io.emit('notification', payload); // Broadcast to all clients
    };

    next();
  };
};

export default notificationMiddleware;
