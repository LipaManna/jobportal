import { cookies } from "next/headers"

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) {
        return null;
    }
    
}