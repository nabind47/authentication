import { refreshAction } from "@/actions/auth";
import { getSession } from "@/lib/sessions";

export async function fetchWithAuth(url: string | URL, options: RequestInit = {}) {
    const session = await getSession();
    if (!session) throw new Error("No session found");

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${session.accessToken}`
    }

    let response = await fetch(url, options);
    if (response.status === 401) {
        console.log("REFRSHING")
        if (!session?.refreshToken) throw new Error("Failed to refresh token");

        const accessToken = await refreshAction(session.refreshToken);
        if (!accessToken) throw new Error("Failed to refresh token");

        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`
        }
        response = await fetch(url, options);
    }
    return response;
}   