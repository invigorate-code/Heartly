"use client";
import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { UserCircle } from "lucide-react";
import Image from "next/image";

export const LandingNavbar = () => {
  return (
    <NextUINavbar isBordered={false} className="bg-transparent" maxWidth="xl">
      <NavbarBrand>
        <Image
          src="/images/logo.png"
          alt="Heartly Logo"
          width={140}
          height={50}
          priority
        />
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            aria-label="Profile"
            className="text-default-500"
            as={Link}
            href="/login"
          >
            <UserCircle size={24} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            color="primary"
            href="/sign-up"
            as={Link}
            className="font-semibold text-white"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
