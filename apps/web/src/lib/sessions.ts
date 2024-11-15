"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
    user: {
        id: string;
        name: string;
        role: string;
    },
    accessToken: string;
    refreshToken: string;
}

const ENCODED = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createSession(payload: Session) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expires)
        .sign(ENCODED);

    cookies().set("session", session, { httpOnly: true, secure: true, expires, sameSite: "strict", path: "/" });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;

    try {

        const decoded = await jwtVerify(session, ENCODED, {
            algorithms: ["HS256"],
        });
        return decoded.payload as Session;

    } catch (error) {
        console.error("failed to verify session", error);
        redirect("/auth/signin");
    }
}

export async function deleteSession() {
    await cookies().delete("session");
}

export async function updateSession({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
    const cookie = cookies().get("session")?.value;
    if (!cookie) return null;

    const { payload } = await jwtVerify(cookie, ENCODED)
    if (!payload) return null;

    const session: Session = {
        user: {
            id: payload.id as string,
            name: payload.name as string,
            role: payload.role as string,
        },
        accessToken,
        refreshToken,
    }
    await createSession(session);
}
