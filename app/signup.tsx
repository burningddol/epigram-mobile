import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { SignUpScreen } from "~/views/signup";

export default function SignUpRoute(): ReactElement {
  return (
    <AuthGate mode="auth-only">
      <SignUpScreen />
    </AuthGate>
  );
}
