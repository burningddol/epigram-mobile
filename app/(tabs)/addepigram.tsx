import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { AddEpigramScreen } from "~/views/add-epigram";

export default function AddEpigramRoute(): ReactElement {
  return (
    <AuthGate mode="protected">
      <AddEpigramScreen />
    </AuthGate>
  );
}
