export const setLocal = (key: string, token: string) => {
    return localStorage.setItem(key, token)
}

export const getLocal = (key: string) => {
    return localStorage.getItem(key)
}

export const removeLocal = (key: string) => {
    return localStorage.removeItem(key)
}