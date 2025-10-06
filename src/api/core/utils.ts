export const buildParamsFromOptions = (options?: { [key: string]: any }) => {
    if (!options) return {};

    const params: Record<string, any> = {};

    for (const [key, value] of Object.entries(options)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            params[key] = value; // Axios automatically serializes arrays
        } else if (value instanceof Date) {
            params[key] = value.toISOString().split(".")[0];
        } else {
            params[key] = value;
        }
    }
    console.log(params);
    return params;
};
