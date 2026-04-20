"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";
// @ts-ignore
import { hashPassword } from "better-auth/crypto";

export async function forceUpdatePassword(userId: string, newPassword: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized. Admin required." };
    }

    const hashed = await hashPassword(newPassword);

    await db.update(account)
      .set({ password: hashed })
      .where(eq(account.userId, userId));

    return { success: true };
  } catch (error) {
    console.error("Failed to force update password:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
