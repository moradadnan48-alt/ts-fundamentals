import { initialProducts } from "./sampleData.js";
import {
    addProduct,
    searchProducts,
    sellProduct,
    generateInventoryReport,
    generateSalesReport
} from "./store.js";
import { Product, SaleTransaction } from "./types.js";

console.log("==================================================");
console.log("🚀 نظام إدارة المنتجات والمبيعات (CLI Demo) - AT-02-A04");
console.log("==================================================\n");

let products: Product[] = [...initialProducts];
const salesHistory: SaleTransaction[] = [];

// 1. عرض المخزون الأولي
console.log("📦 [1] المخزون الأولي:");
console.table(products.map(p => ({
    المعرف: p.id,
    الاسم: p.name,
    السعر: `$${p.price}`,
    الكمية: p.quantity,
    الحالة: p.status,
    التصنيف: p.category
})));

// 2. إضافة صنف جديد مع التحقق
console.log("\n➕ [2] إضافة صنف جديد إلى المخزون:");
const newItem: Product = {
    id: 5,
    name: "Anti-Radiation Glasses",
    price: 95,
    quantity: 12,
    status: "Available",
    category: "Medical"
};
products = addProduct(products, newItem);
console.log(`✅ تمت إضافة المنتج (${newItem.name}) بنجاح!`);

// 3. البحث
console.log("\n🔍 [3] البحث عن نظارات ذكية:");
const searchResults = searchProducts(products, "Murad");
console.log(`تم العثور على: ${searchResults.map(p => `${p.name} ($${p.price})`).join(", ")}`);

// 4. عرض الميزة الجديدة مباشرة: بيع منتج وتسجيل المعاملة
console.log("\n💰 [4] عرض ميزة جديدة مباشرة (تنفيذ عملية بيع):");
console.log("بيع 3 قطع من 'Smart Glasses Murad'...");
const sale1 = sellProduct(products, 19, 3, 101);
products = sale1.updatedProducts;
salesHistory.push(sale1.transaction);
console.log(`🧾 تم إصدار الفاتورة رقم #${sale1.transaction.id}:`);
console.log(`   المنتج: ${sale1.transaction.productName}`);
console.log(`   الكمية المباعة: ${sale1.transaction.quantitySold} قطع`);
console.log(`   إجمالي المبلغ: $${sale1.transaction.totalAmount}`);

// 5. تجربة استثناء نقص المخزون (Error Handling)
console.log("\n⚠️ [5] تجربة محاولة بيع كمية تتجاوز المتوفر بالمخزون:");
try {
    sellProduct(products, 2, 999);
} catch (error) {
    if (error instanceof Error) {
        console.log(`   [معالجة الاستثناء]: ${error.message}`);
    }
}

// 6. إصدار التقارير
console.log("\n📊 [6] تقرير المخزون الحالي:");
const invReport = generateInventoryReport(products);
console.log(`   - إجمالي الأصناف: ${invReport.totalItems}`);
console.log(`   - الأصناف المتوفرة: ${invReport.availableCount}`);
console.log(`   - الأصناف المنتهية: ${invReport.outOfStockCount}`);
console.log(`   - إجمالي قيمة المخزون الحالي: $${invReport.totalValue}`);

console.log("\n📈 [7] تقرير المبيعات والإيرادات:");
const salesRep = generateSalesReport(salesHistory);
console.log(`   - عدد عمليات البيع: ${salesRep.totalSalesCount}`);
console.log(`   - إجمالي القطع المباعة: ${salesRep.totalUnitsSold}`);
console.log(`   - إجمالي الإيرادات المحققة: $${salesRep.totalRevenue}`);
console.log("\n==================================================");
