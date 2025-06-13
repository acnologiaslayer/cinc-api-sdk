export interface Asset {
    id: string;
    name: string;
    type: string;
    value: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface AssetResponse {
    success: boolean;
    data: Asset | Asset[];
    message?: string;
}