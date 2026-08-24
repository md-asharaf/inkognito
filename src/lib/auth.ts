import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmail } from "./resend";

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
const client = globalForMongo._mongoClient || new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/mystery-message");
if (process.env.NODE_ENV !== "production") globalForMongo._mongoClient = client;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_build",
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, user.name || "User", url);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
  plugins: [nextCookies()],
  user: {
    modelName: "users",
    additionalFields: {
      username: { type: "string" },
      isVerified: { type: "boolean", defaultValue: false },
      isAcceptingMessages: { type: "boolean", defaultValue: true },
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.username) {
            const baseUsername = user.email ? user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") : `user${Math.random().toString(36).substring(2, 7)}`;
            user.username = `${baseUsername}_${Math.floor(Math.random() * 10)}`;
          }
          return { data: user };
        },
      },
    },
  }
});
