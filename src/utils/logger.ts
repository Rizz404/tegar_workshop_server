import { consoleTransport, fileTransport, logFormat } from "@/configs/logger";
import path from "path";
import winston, { transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// * Environment check
const isNetlify = process.env.NETLIFY === "true";
const isProduction = process.env.NODE_ENV === "production";

// * Transport configuration
const mainTransports: winston.transport[] = [consoleTransport];
if (!isNetlify && fileTransport) {
  mainTransports.push(fileTransport as DailyRotateFile);
}

// * Exception handling configuration
const exceptionHandlers: winston.transport[] = [consoleTransport];
const rejectionHandlers: winston.transport[] = [consoleTransport];

if (!isNetlify) {
  const exceptionFileTransport = new DailyRotateFile({
    filename: path.join(__dirname, "..", "logs", "exceptions-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: logFormat,
  });

  const rejectionFileTransport = new DailyRotateFile({
    filename: path.join(__dirname, "..", "logs", "rejections-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: logFormat,
  });

  exceptionHandlers.push(exceptionFileTransport);
  rejectionHandlers.push(rejectionFileTransport);
}

// * Create logger
const logger = winston.createLogger({
  level: "info",
  transports: mainTransports,
  exceptionHandlers,
  rejectionHandlers,
  handleExceptions: true,
  handleRejections: true,
});

export default logger;
