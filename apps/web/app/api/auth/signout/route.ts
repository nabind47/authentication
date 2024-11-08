import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { deleteSession } from "@/lib/sessions";

export async function GET(req: NextRequest) {
    await deleteSession();

    revalidatePath("/")
    redirect("/auth/signin");
}
