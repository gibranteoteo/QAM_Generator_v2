import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Setting meteorologist as admin...");
  try {
    await db.update(user).set({ role: "admin" }).where(eq(user.email, "meteorologist@qam.local"));
    console.log("Success! Meteorologist is now an admin.");
  } catch (error) {
    console.error("Failed:", error);
  }
}

main();
