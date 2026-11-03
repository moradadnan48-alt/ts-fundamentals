import { storeProducts, Product } from "./product.js";
function findProductById(products: Product[], targetId: number): Product {
    const product = products.find(p => p.id === targetId);
    if (!product) {
        throw new Error(`Product with ID ${targetId} not found!`);
    }
    return product;
}

console.log("=== Testing Modularization and Error Handling ===");

try {
    let targetProduct = findProductById(storeProducts, 19);
    console.log("Found Product Successfully:", targetProduct);

    // Testing error handling with non-existent ID
    let missingProduct = findProductById(storeProducts, 999);
    console.log(missingProduct);
} catch (error: unknown) {
    if (error instanceof Error) {
        console.log("Caught an Error:", error.message);
    } else {
        console.log("An unknown error occurred.");
    }
}