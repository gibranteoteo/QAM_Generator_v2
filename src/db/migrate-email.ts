import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Migrating email to qam.local...");
  try {
    await db.update(user).set({ email: "meteorologist@qam.local" }).where(eq(user.email, "meteorologist@example.com"));
    console.log("Success! Email is now meteorologist@qam.local.");
  } catch (error) {
    console.error("Failed:", error);
  }
}

main();
