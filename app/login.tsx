import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { LoginScreen } from "~/views/login";

export default function LoginRoute(): ReactElement {
  return (
    <AuthGate mode="auth-only">
      <LoginScreen />
    </AuthGate>
  );
}
