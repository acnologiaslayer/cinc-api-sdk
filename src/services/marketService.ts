import HttpClient from '../utils/httpClient';
import { Market, MarketResponse } from '../types/market';

export default class MarketService {
    private httpClient: HttpClient;

    constructor(httpClient?: HttpClient) {
        this.httpClient = httpClient || new HttpClient();
    }

    public async getMarketData(): Promise<MarketResponse> {
        const response = await this.httpClient.get<MarketResponse>('/market/data');
        return response.data;
    }

    public async getMarketTrends(): Promise<Market[]> {
        const response = await this.httpClient.get<Market[]>('/market/trends');
        return response.data;
    }

    public async getMarketById(id: string): Promise<Market> {
        const response = await this.httpClient.get<Market>(`/market/${id}`);
        return response.data;
    }

    public async searchMarkets(query: string): Promise<Market[]> {
        const response = await this.httpClient.get<Market[]>(`/market/search?query=${query}`);
        return response.data;
    }
}