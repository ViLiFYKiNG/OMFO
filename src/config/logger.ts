import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'AUTH-SERVICE' },
  transports: [
    new winston.transports.File({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: process.env.NODE_ENV === 'production',
      filename: 'auth-service.log',
      dirname: './logs',
    }),
    new winston.transports.File({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      filename: 'auth-service-error.log',
      dirname: './logs',
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
export default logger;
