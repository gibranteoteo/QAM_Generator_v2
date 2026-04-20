import { auth } from "../lib/auth";

async function main() {
  console.log("Seeding initial user...");

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "meteorologist@example.com",
        password: "password123",
        name: "Meteorologist 1",
      },
    });
    console.log("User successfully created!", res);
  } catch (error) {
    console.error("Failed to seed user:", error);
  }
}

main();
