import { Product, StockStatus, SaleTransaction, InventoryReport, SalesReport } from "./types.js";
import { ProductNotFoundError, InvalidProductError, InsufficientStockError } from "./errors.js";

/**
 * البحث عن منتج بواسطة المعرّف (ID).
 */
export function findProductById(products: Product[], id: number): Product {
    const product = products.find(p => p.id === id);
    if (!product) {
        throw new ProductNotFoundError(id);
    }
    return product;
}

/**
 * إضافة منتج جديد مع التحقق الكامل من صحة المدخلات.
 */
export function addProduct(products: Product[], newProduct: Product): Product[] {
    if (!newProduct.name || newProduct.name.trim() === "") {
        throw new InvalidProductError("Product name cannot be empty.");
    }
    if (newProduct.price <= 0) {
        throw new InvalidProductError("Product price must be greater than zero.");
    }
    if (newProduct.quantity < 0) {
        throw new InvalidProductError("Product quantity cannot be negative.");
    }
    if (products.some(p => p.id === newProduct.id)) {
        throw new InvalidProductError(`Product with ID ${newProduct.id} already exists.`);
    }

    // تحديد الحالة تلقائياً بناءً على الكمية
    const resolvedProduct: Product = {
        ...newProduct,
        status: newProduct.quantity > 0 ? "Available" : "Out of Stock"
    };

    return [...products, resolvedProduct];
}

/**
 * البحث في المنتجات بالاسم أو التصنيف (تجاهل حالة الأحرف).
 */
export function searchProducts(products: Product[], query: string): Product[] {
    const q = query.toLowerCase().trim();
    return products.filter(
        p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
}

/**
 * تنفيذ عملية بيع: خصم الكمية، وتحديث الحالة إلى 'Out of Stock' تلقائياً عند النفاد، وإرجاع المعاملة.
 */
export function sellProduct(
    products: Product[],
    productId: number,
    quantityToSell: number,
    transactionId: number = Date.now()
): { updatedProducts: Product[]; transaction: SaleTransaction } {
    if (quantityToSell <= 0) {
        throw new InvalidProductError("Quantity to sell must be greater than zero.");
    }

    const product = findProductById(products, productId);

    if (product.quantity < quantityToSell || product.status === "Out of Stock") {
        throw new InsufficientStockError(product.name, quantityToSell, product.quantity);
    }

    const updatedQty = product.quantity - quantityToSell;
    const updatedStatus: StockStatus = updatedQty === 0 ? "Out of Stock" : "Available";

    const updatedProducts = products.map(p =>
        p.id === productId ? { ...p, quantity: updatedQty, status: updatedStatus } : p
    );

    const transaction: SaleTransaction = {
        id: transactionId,
        productId: product.id,
        productName: product.name,
        quantitySold: quantityToSell,
        unitPrice: product.price,
        totalAmount: product.price * quantityToSell,
        date: new Date().toISOString().split("T")[0]
    };

    return { updatedProducts, transaction };
}

/**
 * توليد تقرير شامل ومختصر عن حالة المخزون.
 */
export function generateInventoryReport(products: Product[]): InventoryReport {
    const available = products.filter(p => p.status === "Available");
    const outOfStock = products.filter(p => p.status === "Out of Stock");
    const totalValue = available.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return {
        totalItems: products.length,
        availableCount: available.length,
        outOfStockCount: outOfStock.length,
        totalValue
    };
}

/**
 * توليد تقرير عن حركة المبيعات والأرباح المحققة.
 */
export function generateSalesReport(salesHistory: SaleTransaction[]): SalesReport {
    const totalUnitsSold = salesHistory.reduce((sum, s) => sum + s.quantitySold, 0);
    const totalRevenue = salesHistory.reduce((sum, s) => sum + s.totalAmount, 0);

    return {
        totalSalesCount: salesHistory.length,
        totalUnitsSold,
        totalRevenue
    };
}
