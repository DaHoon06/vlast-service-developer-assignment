export const generateCode = (length = 8): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((b) => b.toString(36).padStart(2, '0'))
        .join('')
        .slice(0, length)
        .toUpperCase();
};
