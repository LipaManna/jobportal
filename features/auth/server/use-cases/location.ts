import { headers } from "next/headers"

const IP_HEADER_PRIORITY = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "x-client-ip",
    "x-forwarded",
    "forwarded",
    "remote_addr"
]

export const getIP = async () => {
    const headerList = await headers()
    for (const header of IP_HEADER_PRIORITY) {
        const ip = headerList.get(header)
        if (ip) {
            return ip
        }
    }
    return "[IP_ADDRESS]"
}