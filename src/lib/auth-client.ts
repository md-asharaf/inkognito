import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const { useSession, signIn, signOut, signUp } = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});
