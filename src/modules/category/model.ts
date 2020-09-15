export interface Category {
    id: string;
    key: string;
    label: string;
    subCategories: Category[];
}

export type GetFullTreeOfCategoriesResponse = {
    success: true;
    categories: Category[];
} | {
    success: false;
    error: string;
};
