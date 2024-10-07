export interface RegisterMutation {
    username: string;
    password: string;
    displayName: string;
}

export interface LoginMutation {
    username: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    token: string;
    role: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        };
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError {
    error: string;
}

export interface Message {
    _id: string;
    author: {
        _id: string,
        username: string;
        displayName: string;
    }
    message: string;
}
