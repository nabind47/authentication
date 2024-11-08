"use server"

import { fetchWithAuth } from "@/lib/rotation";

export async function getProfile() {
    const res = await fetchWithAuth(`http://localhost:3001/auth/profile`);
    const data = await res.json();
    return data;
}