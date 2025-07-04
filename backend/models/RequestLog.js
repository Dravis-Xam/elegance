// models/RequestLog.js
import mongoose from 'mongoose';

const RequestLogSchema = new mongoose.Schema({
  method: String,
  path: String,
  status: Number,
  responseTime: Number,
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ip: String,
});

const RequestLog = mongoose.model('RequestLog', RequestLogSchema);
export default RequestLog;
