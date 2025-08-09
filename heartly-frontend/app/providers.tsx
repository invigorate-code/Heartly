import { FacilityProvider } from "@/shared/context/FacilityContext";
import { UserProvider } from "@/shared/context/UserContext";
import { SessionProvider } from "@/shared/context/SessionContext";
import { HeroUIProvider } from "@heroui/react";
import { DrawerProvider } from "@/shared/context/DrawerContext";
import { GlobalDrawer } from "@/components/GlobalDrawer";

export default function Providers({ children }) {
  return (
    <HeroUIProvider>
      <SessionProvider>
        <UserProvider>
          <FacilityProvider>
            <DrawerProvider>
              {children}
              <GlobalDrawer />
            </DrawerProvider>
          </FacilityProvider>
        </UserProvider>
      </SessionProvider>
    </HeroUIProvider>
  );
}
