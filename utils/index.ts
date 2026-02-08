export const phoneAddCode = (phone: string, regionCode: string = "vi") => {
    if (regionCode === "vi") {
        if (phone.startsWith("+84")) {
            return phone
        }
        return "+84" + phone.slice(1)
    }
    return "+" + phone
}

export const phoneRegion = (phone: string, regionCode: string = "vi") => {
    if (regionCode === "vi") {
        return "0" + phone.slice(3)
    }
    return phone
}
