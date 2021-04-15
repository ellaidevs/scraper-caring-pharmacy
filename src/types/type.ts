export interface Product {
    provider_name: string;
    url: string;
    product_id: string;
    name: string;
    currency: string;
    price: number;
    original_price?: number | null;
    promotion_price?: number | null;
    promotion?: boolean;
    stock?: number;
    unit: string;
    is_assorted: boolean;
}