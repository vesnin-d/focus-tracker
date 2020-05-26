import { Task } from './types';

export interface AuthData {
  token: string;
  userId: string;
}

export interface AppState {
    authData: AuthData | null,
    currentTimer: any;
    currentUser: any;
    tasks: Task[];
    currentTaskId?: string;
}

export const ACTIONS = {
    USER: {
        LOGIN: 'USER_LOGIN',
        LOGOUT: 'USER_LOGOUT',
        SET_CURRENT: 'USER_SET_CURRENT'
    },
    TASK: {
        ADD: 'TASK_ADD',
        UPDATE: 'TASK_UPDATE',
        SET_CURRENT: 'TASK_SET_CURRENT'
    }
};
  
export function reducer(state: AppState, action: any): AppState {
    switch(action.type) {
        case ACTIONS.USER.LOGIN:
            return {
                ...state,
                authData: action.payload
            };
        case ACTIONS.USER.LOGOUT:
            return {
                ...state,
                authData: null,
                currentUser: null
            };
        case ACTIONS.USER.SET_CURRENT:
            return {
                ...state,
                currentUser: action.payload,
                tasks: action.payload.tasks
            }; 
        case ACTIONS.USER.LOGOUT:
            return {
                ...state,
                authData: null,
                currentUser: null
            };
        case ACTIONS.TASK.ADD:
            console.log(action.payload, state.tasks);
            return {
                ...state,
                tasks: [
                    action.payload,
                    ...state.tasks
                ]
            }; 
        case ACTIONS.TASK.UPDATE:
            return {
                ...state,
                tasks: state.tasks.map((task) => {
                    if(task.id === action.payload.id) {
                        return action.payload;
                    }

                    return task;
                })
            }; 
        case ACTIONS.TASK.SET_CURRENT:
            return {
                ...state,
                currentTaskId: action.payload
            };
    }
  
    return state;
}