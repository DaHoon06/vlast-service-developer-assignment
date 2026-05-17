type ErrorObjectType = {
    message: string;
    statusCode: number;
    data: Record<string, unknown>;
};

class FetchError extends Error {
    public status: number;
    public statusText: string;

    constructor(
        response: Response,
        public data: ErrorObjectType,
    ) {
        const errorMessage =
            typeof data === 'object' && data !== null && 'error' in data
                ? data.message
                : `Fetch failed with status ${response.status}`;

        super(errorMessage);

        this.status = response.status;
        this.statusText = response.statusText;
    }
}
export { FetchError };
export type { ErrorObjectType };
