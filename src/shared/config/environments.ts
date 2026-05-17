export const isProduction = process.env.NODE_ENV === ('production' as const);

export const BASE_URL =
    (isProduction
        ? process.env.NEXT_PUBLIC_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_DEVELOPMENT_URL) ?? 'http://localhost:3000';
