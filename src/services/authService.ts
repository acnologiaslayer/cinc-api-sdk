import { AuthResponse } from '../types/auth';
import HttpClient from '../utils/httpClient';

export class AuthService {
    private httpClient: HttpClient;

    constructor(httpClient?: HttpClient) {
        this.httpClient = httpClient || new HttpClient();
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.httpClient.post<AuthResponse>(`/auth/login`, {
            email,
            password
        });
        return response.data;
    }

    async logout(): Promise<void> {
        await this.httpClient.post(`/auth/logout`, {});
    }
}