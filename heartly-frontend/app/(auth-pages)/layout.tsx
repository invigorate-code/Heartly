import Header from "@/components/Header/Header";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
} from "@heroui/react";
import Logo from "@/app/logo.png";
import Image from "next/image";
export default async function Layout({ children }) {
  return (
    <div className="flex flex-col bg-[#f8f8f8]">
      <Navbar
        isBordered
        maxWidth="full"
        classNames={{
          base: "rounded-b-3xl",
          item: "data-[active=true]:text-primary",
          wrapper: "px-4 sm:px-6",
          brand: "mx-auto justify-center",
        }}
        height="64px"
      >
        <NavbarContent className="flex w-full" justify="center">
          <NavbarBrand>
            <a
              className="inline-flex items-center gap-x-2 text-xl font-semibold"
              href="/"
            >
              <Image
                width={112}
                height={40}
                src="/images/logo.png"
                alt="Logo"
                priority
              />
            </a>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center">
        {children}
      </div>
    </div>
  );
}
