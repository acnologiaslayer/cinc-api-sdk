export interface Market {
    id: string;
    name: string;
    symbol: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
}

export interface MarketResponse {
    markets: Market[];
    totalMarkets: number;
    totalVolume: number;
}