const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({
            filename: path.join(__dirname, '../logs/exceptions.log'),
            maxsize: 5242880,
            maxFiles: 5,
            tailable: true,
            zippedArchive: true
        })
    ],
    exceptionHandlers: [
        new transports.File({ 
            filename: path.join(__dirname, '../logs/exceptions.log')
        })
    ]
});

module.exports = { logger };