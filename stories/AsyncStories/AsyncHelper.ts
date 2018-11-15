export const delay = (timeout: number): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout);
    });
};

export const getValueAfter = async <T>(value: T, timeout: number): Promise<T> => {
    await delay(timeout);
    return value;
};
