import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, json } = format;

const myFormat = printf(({ level, message, timestamp, stack }) => {
  // if an error with stack is passed, include the stack
  return stack
    ? `${timestamp} ${level}: ${message} - ${stack}`
    : `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp(),
    errors({ stack: true }), // <-- capture stack trace
    json() // logs in structured JSON (good for ELK)
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      format: combine(timestamp(), myFormat)
    }),

    // Optionally write to a file in production
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' })
  ],
  exitOnError: false
});

export default logger;
