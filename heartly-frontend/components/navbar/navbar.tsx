"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/react";
import React from "react";
import Image from "next/image";
import Logo from "@/app/logo.png";
import { ChevronDown, Scale, Activity, Flash, TagUser } from "../icons/Icons";

export const Nav = () => {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale className="text-warning" fill="currentColor" size={30} />,
    activity: (
      <Activity className="text-secondary" fill="currentColor" size={30} />
    ),
    flash: <Flash className="text-primary" fill="currentColor" size={30} />,
    user: <TagUser className="text-danger" fill="currentColor" size={30} />,
  };
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <a
            className="inline-flex items-center gap-x-2 text-xl font-semibold text-white dark:text-white"
            href="/"
          >
            <Image src={Logo} width={120} height={120} alt="Logo" />
          </a>
        </NavbarBrand>
      </NavbarContent>
      <NavbarBrand>
        <a
          className="inline-flex items-center gap-x-2 text-xl font-semibold text-white dark:text-white"
          href="/"
        >
          <Image src={Logo} width={120} height={120} alt="Logo" />
        </a>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="#">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#">Pricing</Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="#">Company</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="success" href="/login" variant="flat">
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
