export interface Portfolio {
    id: string;
    userId: string;
    assets: PortfolioAsset[];
    createdAt: Date;
    updatedAt: Date;
}

export interface PortfolioAsset {
    id: string;
    name: string;
    quantity: number;
    value: number;
}

export interface PortfolioResponse {
    portfolio: Portfolio;
    message: string;
}

export interface PortfolioListResponse {
    portfolios: Portfolio[];
    message: string;
}