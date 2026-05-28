import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '../services/AuthSession';

export class APIAdapter {
    private api: AxiosInstance;

    constructor(endpoint: string = '') {
        const basePath = endpoint ? `/api/${endpoint}` : '/api';

        this.api = axios.create({
            baseURL: `http://localhost:8080${basePath}`
        });

        this.api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
            const token = await getAuthToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });
    }

    async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};

            if (params) {
                config.params = params;
            }

            const response = await this.api.get<T>(path, config);
            return response.data;
        } catch (error) {
            throw this.handleError('GET', path, error);
        }
    }

    async post<T>(path: string, data?: any, params?: Record<string, any>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};

            if (params) {
                config.params = params;
            }

            const response = await this.api.post<T>(path, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError('POST', path, error);
        }
    }

    async patch<T>(path: string, data?: any, params?: Record<string, any>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};

            if (params) {
                config.params = params;
            }

            const response = await this.api.patch<T>(path, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError('PATCH', path, error);
        }
    }

    async put<T>(path: string, data?: any, params?: Record<string, any>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};

            if (params) {
                config.params = params;
            }

            const response = await this.api.put<T>(path, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError('PUT', path, error);
        }
    }

    async delete<T>(path: string, params?: Record<string, any>): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};

            if (params) {
                config.params = params;
            }

            const response = await this.api.delete<T>(path, config);
            return response.data;
        } catch (error) {
            throw this.handleError('DELETE', path, error);
        }
    }

    private handleError(method: string, path: string, error: any): Error {
        console.error(`[APIAdapter] ${method} ${path} failed:`, error);

        if (error.response?.status === 401) {
            return new Error('Não autorizado. Por favor, faça login novamente.');
        }

        if (error.response?.status === 404) {
            return new Error(`Recurso não encontrado: ${path}`);
        }

        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }

        return new Error(`Erro na requisição ${method} ${path}: ${error.message}`);
    }
}

export default APIAdapter;
