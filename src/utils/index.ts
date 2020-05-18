export function getTimestampInSeconds() {
    const timestampInMS = Date.now();
    return Math.floor(timestampInMS / 1000);
}