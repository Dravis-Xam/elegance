// sentry.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN, // Your Sentry DSN
  tracesSampleRate: 1.0, // Adjust this value to control the amount of

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

export default Sentry;
