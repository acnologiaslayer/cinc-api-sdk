import HttpClient from '../utils/httpClient';
import { Asset, AssetResponse } from '../types/asset';

export default class AssetService {
    private httpClient: HttpClient;

    constructor(httpClient?: HttpClient) {
        this.httpClient = httpClient || new HttpClient();
    }

    public async getAssets(): Promise<Asset[]> {
        const response = await this.httpClient.get<Asset[]>('/assets');
        return response.data;
    }

    public async getAssetById(assetId: string): Promise<Asset> {
        const response = await this.httpClient.get<Asset>(`/assets/${assetId}`);
        return response.data;
    }

    public async createAsset(asset: Asset): Promise<Asset> {
        const response = await this.httpClient.post<Asset>('/assets', asset);
        return response.data;
    }

    public async updateAsset(assetId: string, asset: Asset): Promise<Asset> {
        const response = await this.httpClient.put<Asset>(`/assets/${assetId}`, asset);
        return response.data;
    }

    public async deleteAsset(assetId: string): Promise<void> {
        await this.httpClient.delete(`/assets/${assetId}`);
    }
}