var winston = require('winston');
const path = require('path');

const filePath = path.join(__dirname ,'..', '..', 'logs', 'app.log');
const logDir = path.join(__dirname ,'..', '..', 'logs');
// console.log(filePath)
// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: filePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
// var logger = winston.Logger({
//   transports: [
//     new winston.transports.File(options.file),
//     new winston.transports.Console(options.console)
//   ],
//   exitOnError: false, // do not exit on handled exceptions
// });

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [
//         //
//         // - Write to all logs with level `info` and below to `combined.log` 
//         // - Write all logs error (and below) to `error.log`.
//         //
//         new winston.transports.File(options.file),
//         new winston.transports.Console(options.console)
//     ]
// });

// // create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//   write: function(message, encoding) {
//     // use the 'info' log level so the output will be picked up by both transports (file and console)
//     logger.info(message);
//   },
// };


const { createLogger, format, transports } = require('winston');
// const logger = createLogger({
//     level: 'debug',
//     format: format.combine(
//       format.colorize(),
//       format.timestamp({
//         format: 'YYYY-MM-DD HH:mm:ss'
//       }),
//       format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
//     ),
//     transports: [
//         new transports.Console(),
//         new transports.File(options.file)
//     ]
//   });

const logger = createLogger({
    transports: [
      new transports.Console({ level: 'info', format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ), colorize: true, handleExceptions: true, humanReadableUnhandledException: true }),

      new transports.File({ filename: path.resolve(logDir, 'silly.log'), level: 'silly', format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ) }),

      new transports.File({ filename: path.resolve(logDir, 'info.log'), level: 'info', format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ) }),

      new transports.File({ filename: path.resolve(logDir, 'error.log'), level: 'error', handleExceptions: true, format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ) })
    ]
  })


module.exports = logger;