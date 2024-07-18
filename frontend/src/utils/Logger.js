// utils/Logger.js
export const logError = (message, error) => {
    console.error(message, error)
    // You can also send the log to an external service here
    // Example: sendLogToServer({ message, error: error.message })
}
