export interface AuthData {
  token: string;
  userId: string;
}

export interface AppState {
    authData: AuthData | null,
    currentTimer: any;
    currentUser: any;
}


export const ACTIONS = {
  USER: {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_CURRENT: 'SET_CURRENT'
  }
}
  
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
          currentUser: action.payload
        }; 
    }
  
    return state;
}