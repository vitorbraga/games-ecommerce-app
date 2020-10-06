/* eslint-disable no-sequences */
export const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:4000';
export const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
export const s3BucketProductPictures = process.env.NEXT_PUBLIC_S3_BUCKET_PRODUCT_PICTURES || 'games-ecommerce-dev';

export enum FetchStatusEnum {
    initial = 'initial',
    loading = 'loading',
    success = 'success',
    failure = 'failure'
}

export type FetchStatus = keyof typeof FetchStatusEnum;

export interface FetchState<T> {
    status: FetchStatus;
    fetchError: string | null;
    data: T;
}

export interface Builder {
    withJwt: (token: string) => Builder;
    with: (name: string, value: string) => Builder;
    build: () => Headers;
}

export function headersBuilder() {
    const headers = new Headers();
    const builder: Builder = {
        withJwt: (token: string) => (headers.append('Authorization', `Bearer ${token}`), builder),
        with: (name: string, value: string) => (headers.append(name, value), builder),
        build: () => headers
    };

    return builder;
}

export function generatePictureURL(fileName: string) {
    return `https://${s3BucketProductPictures}.s3-eu-west-1.amazonaws.com/${fileName}`;
}

export interface FieldWithError {
    field: string;
    constraints: {
        [type: string]: string;
    };
}
