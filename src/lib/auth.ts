import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "@/db"; 
import * as schema from "@/db/schema";
import { getBaseUrl } from "./url";

export const auth = betterAuth({
    baseURL: getBaseUrl(),
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: {
          ...schema
        }
    }),
    emailAndPassword: {
      enabled: true
    },
    plugins: [
        admin()
    ]
});
