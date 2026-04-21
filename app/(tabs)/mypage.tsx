import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { MypageScreen } from "~/views/mypage";

export default function MypageRoute(): ReactElement {
  return (
    <AuthGate mode="protected">
      <MypageScreen />
    </AuthGate>
  );
}
