export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LogoutResponse {
    message: string;
}