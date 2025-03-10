import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const isNetlify = process.env.NETLIFY === "true";

// * Base log format
export const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} ${level}: ${message}\n${stack}`
      : `${timestamp} ${level}: ${message}`;
  })
);

// * Console transport
export const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), logFormat),
});

// * File transport (hanya untuk non-Netlify)
export const fileTransport: DailyRotateFile | null = isNetlify
  ? null
  : new DailyRotateFile({
      filename: path.join(__dirname, "..", "logs", "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: logFormat,
    });
