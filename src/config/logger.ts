import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'AUTH-SERVICE' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      level: 'info',
      silent: process.env.NODE_ENV === 'test',
      filename: 'auth-service.log',
      dirname: './logs',
    }),
    new winston.transports.File({
      level: 'error',
      silent: process.env.NODE_ENV === 'test',
      filename: 'auth-service-error.log',
      dirname: './logs',
    }),
    new winston.transports.Console({
      level: 'info',
      silent: process.env.NODE_ENV === 'test',
    }),
  ],
});
export default logger;
