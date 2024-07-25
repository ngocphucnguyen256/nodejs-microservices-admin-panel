export type Action=  {
    type: string,
    payload: any
}


export type User = {
    id: string,
    token?: string,
    email: string,
    username: string,
    avatarUrl?: string,
    lastSeen?: string,
    role?: string,
}

export interface AuthState {
    user: User;
    isAuthenticated: boolean;
    error: string;
}
  
export interface AppState {
    auth: AuthState;
}


export type Notification ={
    id: string;
    payload: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    service:{
        id: string;
        name: string;
        description: string | null;
    }
}

export type ChatRoom ={
    id: string;
    name: string; 
    createdAt: string; 
    updatedAt: string 
}

export type Message = {
    id: string;
    content: string;
    status: string;
    createdAt: string;
    user: User;
}


export interface PayloadAction extends Action {
    payload: any;
  }