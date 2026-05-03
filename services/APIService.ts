import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export default class APIService {
    #api: AxiosInstance;
    #userHeaderName = 'X-User-ID';

    constructor(mapping: string = '') {
        const basePath = mapping ? `/api/${mapping}` : '/api';

        this.#api = axios.create({
            baseURL: `http://localhost:8080${basePath}`
        });

        this.#api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
            return config;
        });
    }

    getApi(): AxiosInstance {
        return this.#api;
    }

    getUserHeader(): string {
        return this.#userHeaderName;
    }
}