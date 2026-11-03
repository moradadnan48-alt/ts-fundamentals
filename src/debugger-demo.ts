/**
 * ملف توثيق وتجربة الأخطاء الـ 5 المقصودة واستخدام الـ Debugger
 * النشاط: AT-02-A03 (تنظيم الكود والاختبار)
 */

import { Product } from "./types.js";
import { ProductNotFoundError, InvalidProductError } from "./errors.js";

// =========================================================================
// الخطأ 1: خطأ مرجعي لعدم التحقق من وجود العنصر (Undefined Dereference Error)
// =========================================================================
// ❌ الخطأ المقصود: محاولة الوصول لخاصية name لمنتج غير موجود دون تحقق
export function faultyGetProductName(products: Product[], id: number): string {
    // const p = products.find(item => item.id === id);
    // return p.name; // سيؤدي إلى: TypeError: Cannot read properties of undefined
    
    // 🔍 تشخيص الـ Debugger: فحص قيمة المتغير 'p' في لوحة Variables نجد قيمته undefined.
    // ✅ الإصلاح: التحقق الصريح أو رمي استثناء مخصص
    const p = products.find(item => item.id === id);
    if (!p) {
        throw new ProductNotFoundError(id);
    }
    return p.name;
}

// =========================================================================
// الخطأ 2: خطأ في شرط الحدود والتكرار (Off-By-One Logic Error)
// =========================================================================
// ❌ الخطأ المقصود: استخدام عامل مقارنة خاطئ (i <= length) يتجاوز حدود المصفوفة
export function faultySearchByIndex(products: Product[], targetId: number): Product | null {
    // for (let i = 0; i <= products.length; i++) { // تجاوز الحد عند i === length
    //     if (products[i].id === targetId) return products[i];
    // }

    // 🔍 تشخيص الـ Debugger: وضع Breakpoint ومراقبة المتغير 'i' نجد أنه يصل إلى length ويصبح products[i] هو undefined.
    // ✅ الإصلاح: استخدام i < products.length أو استخدام find
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === targetId) return products[i];
    }
    return null;
}

// =========================================================================
// الخطأ 3: قبول قيم غير منطقية كالسعر السالب (Missing Input Validation)
// =========================================================================
// ❌ الخطأ المقصود: إضافة منتج بدون التحقق من صحة وقيمة السعر
export function faultyValidatePrice(price: number): boolean {
    // return true; // يقبل الأسعار السالبة مثل -50 دون أي اعتراض

    // 🔍 تشخيص الـ Debugger: فحص مدخلات الدالة 'price' في نافذة Watch يظهر -50
    // ✅ الإصلاح: فحص صارم يضمن أن السعر أكبر تماماً من الصفر
    if (price <= 0 || isNaN(price)) {
        throw new InvalidProductError("Product price must be greater than zero.");
    }
    return true;
}

// =========================================================================
// الخطأ 4: تعديل البيانات الأصلية وتأثيرها الجانبي غير المرغوب (Direct Mutation Side-Effect)
// =========================================================================
// ❌ الخطأ المقصود: تعديل المصفوفة الأصلية بواسطة push بدلاً من إرجاع مصفوفة نقية جديدة (Pure Function)
export function faultyAddProductMutation(products: Product[], newProduct: Product): Product[] {
    // products.push(newProduct); // يعدل نفس المرجع في الذاكرة مما يسبب آثاراً جانبية للاختبارات الأخرى

    // 🔍 تشخيص الـ Debugger: عند مراقبة مرجع products في Memory Heap نجد أنه تم تلويث البيانات الأصلية
    // ✅ الإصلاح: استخدام الـ Spread Operator [...products, newProduct] لإنشاء مصفوفة جديدة غير قابلة للتغيير
    return [...products, newProduct];
}

// =========================================================================
// الخطأ 5: خطأ في حساب التراكم بالقيمة الابتدائية (Accumulator NaN / Initial Value Bug)
// =========================================================================
// ❌ الخطأ المقصود: نسيان تمرير القيمة الابتدائية (0) في دالة reduce
export function faultyCalculateTotal(products: Product[]): number {
    // return products.reduce((acc, curr) => acc + curr.price); // سيعيد [object Object] أو NaN لأن acc سيبدأ ككائن Product

    // 🔍 تشخيص الـ Debugger: بالدخول خطوة بخطوة (Step Into F11) داخل الـ callback، نجد نوع 'acc' كائناً وليس رقماً
    // ✅ الإصلاح: تحديد القيمة الابتدائية للعداد بـ 0
    return products.reduce((sum, item) => sum + item.price, 0);
}
