export interface TimerDescriptor {
    id?: string;
    duration: number;
    remains: number;
    isRunning: boolean;
    isCompleted: boolean;
}

export interface Task {
    id?: string;
    title: string;
    isCompleted: boolean;
}