import HttpClient from '../utils/httpClient';
import { Portfolio, PortfolioResponse } from '../types/portfolio';

export default class PortfolioService {
    private httpClient: HttpClient;

    constructor(httpClient?: HttpClient) {
        this.httpClient = httpClient || new HttpClient();
    }

    public async getPortfolio(userId: string): Promise<PortfolioResponse> {
        const response = await this.httpClient.get<PortfolioResponse>(`/portfolios/${userId}`);
        return response.data;
    }

    public async createPortfolio(userId: string, portfolio: Portfolio): Promise<PortfolioResponse> {
        const response = await this.httpClient.post<PortfolioResponse>(`/portfolios/${userId}`, portfolio);
        return response.data;
    }

    public async updatePortfolio(userId: string, portfolioId: string, portfolio: Portfolio): Promise<PortfolioResponse> {
        const response = await this.httpClient.put<PortfolioResponse>(`/portfolios/${userId}/${portfolioId}`, portfolio);
        return response.data;
    }

    public async deletePortfolio(userId: string, portfolioId: string): Promise<void> {
        await this.httpClient.delete(`/portfolios/${userId}/${portfolioId}`);
    }
}