import { describe, it, expect, beforeEach } from "vitest";
import { Product, SaleTransaction } from "../src/types.js";
import { ProductNotFoundError, InvalidProductError, InsufficientStockError } from "../src/errors.js";
import {
    findProductById,
    addProduct,
    searchProducts,
    sellProduct,
    generateInventoryReport,
    generateSalesReport
} from "../src/store.js";

describe("Store & Sales System Tests - AT-02-A04", () => {
    let mockProducts: Product[];

    beforeEach(() => {
        mockProducts = [
            { id: 1, name: "Medical Glasses A", price: 100, quantity: 10, status: "Available", category: "Medical" },
            { id: 2, name: "Sunglasses B", price: 50, quantity: 2, status: "Available", category: "Sun" },
            { id: 19, name: "Smart Glasses Murad", price: 200, quantity: 5, status: "Available", category: "Smart" },
            { id: 4, name: "Reading Glasses C", price: 30, quantity: 0, status: "Out of Stock", category: "Medical" }
        ];
    });

    // 1. البحث
    it("1. should find product by ID", () => {
        const product = findProductById(mockProducts, 19);
        expect(product.name).toBe("Smart Glasses Murad");
    });

    it("2. should throw ProductNotFoundError when ID does not exist", () => {
        expect(() => findProductById(mockProducts, 999)).toThrow(ProductNotFoundError);
    });

    // 2. الإضافة والتحقق من المدخلات
    it("3. should add a new valid product", () => {
        const item: Product = { id: 5, name: "Screen Glasses", price: 80, quantity: 4, status: "Available", category: "Digital" };
        const updated = addProduct(mockProducts, item);
        expect(updated.length).toBe(5);
    });

    it("4. should throw InvalidProductError on invalid price or negative quantity", () => {
        const invalidPrice: Product = { id: 6, name: "A", price: -10, quantity: 5, status: "Available", category: "Sun" };
        const negativeQty: Product = { id: 7, name: "B", price: 20, quantity: -2, status: "Available", category: "Sun" };
        expect(() => addProduct(mockProducts, invalidPrice)).toThrow(InvalidProductError);
        expect(() => addProduct(mockProducts, negativeQty)).toThrow(InvalidProductError);
    });

    it("5. should throw InvalidProductError on duplicate product ID", () => {
        const dup: Product = { id: 1, name: "Dup", price: 50, quantity: 1, status: "Available", category: "Medical" };
        expect(() => addProduct(mockProducts, dup)).toThrow(InvalidProductError);
    });

    // 3. البحث بالاسم والتصنيف
    it("6. should search products by name or category", () => {
        const results = searchProducts(mockProducts, "Sun");
        expect(results.length).toBe(1);
        expect(results[0].name).toBe("Sunglasses B");
    });

    // 4. ميزة البيع (الميزة الجديدة)
    it("7. should successfully sell a product and deduct inventory quantity", () => {
        const { updatedProducts, transaction } = sellProduct(mockProducts, 1, 3, 1001);
        const item = findProductById(updatedProducts, 1);
        expect(item.quantity).toBe(7);
        expect(item.status).toBe("Available");
        expect(transaction.quantitySold).toBe(3);
        expect(transaction.totalAmount).toBe(300);
    });

    it("8. should automatically mark product as 'Out of Stock' when quantity reaches 0", () => {
        const { updatedProducts } = sellProduct(mockProducts, 2, 2);
        const item = findProductById(updatedProducts, 2);
        expect(item.quantity).toBe(0);
        expect(item.status).toBe("Out of Stock");
    });

    it("9. should throw InsufficientStockError when requested quantity exceeds available stock", () => {
        expect(() => sellProduct(mockProducts, 2, 10)).toThrow(InsufficientStockError);
        expect(() => sellProduct(mockProducts, 4, 1)).toThrow(InsufficientStockError);
    });

    // 5. التقارير
    it("10. should generate correct inventory report", () => {
        const report = generateInventoryReport(mockProducts);
        expect(report.totalItems).toBe(4);
        expect(report.availableCount).toBe(3);
        expect(report.outOfStockCount).toBe(1);
        // قيمة المتوفر: (10*100) + (2*50) + (5*200) = 1000 + 100 + 1000 = 2100
        expect(report.totalValue).toBe(2100);
    });

    it("11. should generate correct sales report", () => {
        const sales: SaleTransaction[] = [
            { id: 1, productId: 1, productName: "A", quantitySold: 2, unitPrice: 100, totalAmount: 200, date: "2026-11-03" },
            { id: 2, productId: 19, productName: "Murad", quantitySold: 1, unitPrice: 200, totalAmount: 200, date: "2026-11-03" }
        ];
        const report = generateSalesReport(sales);
        expect(report.totalSalesCount).toBe(2);
        expect(report.totalUnitsSold).toBe(3);
        expect(report.totalRevenue).toBe(400);
    });
});
