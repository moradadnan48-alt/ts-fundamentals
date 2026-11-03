export class ProductNotFoundError extends Error {
    constructor(id: number) {
        super(`Product with ID ${id} not found!`);
        this.name = "ProductNotFoundError";
    }
}

export class InvalidProductError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidProductError";
    }
}

export class InsufficientStockError extends Error {
    constructor(productName: string, requested: number, available: number) {
        super(`Insufficient stock for '${productName}'. Requested: ${requested}, Available: ${available}`);
        this.name = "InsufficientStockError";
    }
}
