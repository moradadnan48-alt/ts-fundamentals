export type StockStatus = "Available" | "Out of Stock";

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status: StockStatus;
    category: string;
}

export interface SaleTransaction {
    id: number;
    productId: number;
    productName: string;
    quantitySold: number;
    unitPrice: number;
    totalAmount: number;
    date: string;
}

export interface InventoryReport {
    totalItems: number;
    availableCount: number;
    outOfStockCount: number;
    totalValue: number;
}

export interface SalesReport {
    totalSalesCount: number;
    totalUnitsSold: number;
    totalRevenue: number;
}
