import { Product } from "./types.js";

export const initialProducts: Product[] = [
    { id: 1, name: "Medical Glasses A", price: 120, quantity: 10, status: "Available", category: "Medical" },
    { id: 2, name: "Sunglasses B", price: 85, quantity: 5, status: "Available", category: "Sun" },
    { id: 19, name: "Smart Glasses Murad", price: 250, quantity: 8, status: "Available", category: "Smart" },
    { id: 4, name: "Reading Glasses C", price: 45, quantity: 0, status: "Out of Stock", category: "Medical" }
];
