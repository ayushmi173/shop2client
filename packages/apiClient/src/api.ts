import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { cookie, COOKIES } from './cookie';

export class BackendServiceOptions {
    includeToken?: boolean;
    baseUrl: string;
}

export class BackendService {
    readonly options: BackendServiceOptions;
    readonly client: AxiosInstance;

    constructor(options: BackendServiceOptions) {
        this.options = options;
        this.client = axios.create({
            baseURL: options.baseUrl,
        });
    }

    getToken(): string | undefined {
        return cookie.get(COOKIES.TOKEN);
    }

    getHeaders(): Record<string, string> {
        const headers = {};
        const token = this.getToken();
        if (this.options.includeToken && token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    static create(options: BackendServiceOptions): BackendService {
        const opt: BackendServiceOptions = {
            ...options,
            includeToken: options?.includeToken ?? false,
        };

        return new BackendService(opt);
    }

    async get<T>(path: string, headers: Record<string, any> = {}): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get<T>(path, {
            headers: { ...this.getHeaders(), ...headers },
        });

        return response.data;
    }

    async post<T, Q>(path: string, data: T): Promise<Q> {
        const response: AxiosResponse<Q> = await this.client.post(path, data, {
            headers: { ...this.getHeaders() },
        });

        return response.data;
    }

    async put<T, Q>(path: string, data: T): Promise<Q> {
        const response: AxiosResponse<Q> = await this.client.put(path, data, {
            headers: { ...this.getHeaders() },
        });

        return response.data;
    }

    async delete<T>(path: string): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(path, {
            headers: { ...this.getHeaders() },
        });

        return response.data;
    }

    async patch<T, Q>(path: string, data: Q): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(path, data, {
            headers: { ...this.getHeaders() },
        });

        return response.data;
    }
}
