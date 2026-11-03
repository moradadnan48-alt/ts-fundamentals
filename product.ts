export type StockStatus = "Available" | "Out of Stock";

export interface Product {
    id: number;
    name: string;
    price: number;
    status: StockStatus;
    category: string;
}

export const storeProducts: Product[] = [
    { id: 1, name: "Medical Glasses A", price: 120, status: "Available", category: "Medical" },
    { id: 2, name: "Sunglasses B", price: 85, status: "Available", category: "Sun" },
    { id: 19, name: "Smart Glasses Murad", price: 250, status: "Available", category: "Smart" },
    { id: 4, name: "Reading Glasses C", price: 45, status: "Out of Stock", category: "Medical" }
];