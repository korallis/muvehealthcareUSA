import { ReactNode } from "react";
import { CookieConsent } from "@/components/CookieConsent";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <div>
        <div className="mt-0 pb-0">{children}</div>
      </div>
      <CookieConsent />
    </main>
  );
};

export default Layout;
