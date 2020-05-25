export function getTimestampInSeconds() {
    const timestampInMS = Date.now();
    return Math.floor(timestampInMS / 1000);
}

export function getFormattedTimeFromSeconds(seconds: number) {
    const numberOfMinutes = Math.floor(seconds / 60);
    const numberOfSeconds = Math.floor(seconds - (numberOfMinutes * 60));

    return {
        minutes: numberOfMinutes >= 10 ? '' + numberOfMinutes : `0${numberOfMinutes}`,
        seconds: numberOfSeconds >= 10 ? '' + numberOfSeconds : `0${numberOfSeconds}`
    };
}
