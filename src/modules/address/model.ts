import { FieldWithError } from '../../utils/api-helper';
import { Country } from '../countries/model';
import { User } from '../user/model';

export interface Address {
    id: string;
    fullName: string;
    line1: string;
    line2: string;
    city: string;
    zipCode: string;
    country: Country;
    info: string;
    createdAt: number;
    updatedAt: number;
}

export interface CreateAddressBody {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    zipCode: string;
    countryId: string;
    info?: string;
}

export type GetUserAddressesResponse = {
    success: true;
    addresses: Address[];
} | {
    success: false;
    error: string;
};

export type SetUserMainAddressResponse = {
    success: true;
    user: User;
} | {
    success: false;
    error: string;
};

export type CreateAddressResponse = {
    success: true;
    user: User;
} | {
    success: false;
    fields: FieldWithError[];
} | {
    success: false;
    error: string;
};

export type RemoveAddressResponse = SetUserMainAddressResponse;
