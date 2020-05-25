export interface TimerDescriptor {
    id?: string;
    duration: number;
    remains: number;
    isRunning: boolean;
    isCompleted: boolean;
}