export interface Country {
    id: string;
    name: string;
}

export type GetAllCountriesResponse = {
    success: true;
    countries: Country[];
} | {
    success: false;
    error: string;
};
