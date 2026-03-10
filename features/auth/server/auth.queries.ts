import { cookies } from "next/headers"
import { validateSessionAndGetUser } from "./use-cases/sessions";

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get("session_token")?.value;
    if (!session) {
        return null;
    }

    const user = await validateSessionAndGetUser(session);
    return user;
}