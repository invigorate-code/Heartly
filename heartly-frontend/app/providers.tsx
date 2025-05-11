import { FacilityProvider } from "@/shared/context/FacilityContext";
import { UserProvider } from "@/shared/context/UserContext";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { DrawerProvider } from "@/shared/context/DrawerContext";
import { GlobalDrawer } from "@/shared/components/GlobalDrawer";

export default function Providers({ children }) {
  return (
    <HeroUIProvider>
      <UserProvider>
      <DrawerProvider>
        <ToastProvider placement="top-right" />
        {children}
        <GlobalDrawer />
      </DrawerProvider>
      </UserProvider>
    </HeroUIProvider>
  );
}
