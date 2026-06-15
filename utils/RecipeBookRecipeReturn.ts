export type PendingRecipeReturn = {
    bookId?: string;
    recipeId: string;
    recipeTitle: string;
    recipeKey?: string;
} | null;

let pendingRecipeReturn: PendingRecipeReturn = null;

export function setPendingRecipeReturn(value: PendingRecipeReturn): void {
    pendingRecipeReturn = value;
}

export function consumePendingRecipeReturn(): PendingRecipeReturn {
    const value = pendingRecipeReturn;
    pendingRecipeReturn = null;
    return value;
}