/**
 * Represents a product in the game.
 */
export interface Product {
    productCode: string;
    categoryId: number;
    isCompound: boolean;
    imageUrl: string;
}