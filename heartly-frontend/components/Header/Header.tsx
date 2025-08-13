"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import {
  Badge,
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import NotificationsCard from "./NotificationsCard";
import { logger } from "@/utils/logger";
import { redirect } from "next/navigation";
import SidebarNavItems from "@/components/sidebar/navitems";
import { useUser } from "@/shared/context/UserContext";
import { UserEntity } from "@/generated/types/UserEntity.js";
import { signOut } from "@/app/api/poc-api-using-api-util/auth";

type HeaderProps = {
  headerPurpose: "onboarding" | "dashboard";
};

const Header: React.FC<HeaderProps> = ({ headerPurpose }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = SidebarNavItems();
  const { userDisplayName } = useUser();
  const userName = userDisplayName();
  const { user } = useUser();

  useEffect(() => {
    // Simulate fetching data
    setNotificationCount(5);
    setUserEmail(user?.email || "");
  }, [user]);

  async function handleSignOut() {
    signOut()
      .then((response) => logger.info("User signed out successfully"))
      .catch((error) =>
        logger.error(
          `User Sign Out Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
  }

  return (
    <Navbar
      isBordered
      maxWidth="full"
      classNames={{
        base: "rounded-b-3xl",
        item: "data-[active=true]:text-primary",
        wrapper: "px-4 sm:px-6",
        brand: `${headerPurpose === "onboarding" ? "mx-auto justify-center" : "justify-start"}`,
      }}
      height="64px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <a
            className="inline-flex items-center gap-x-2 text-xl font-semibold"
            href="/"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={112}
              height={40}
              priority
            />
          </a>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="border-x-small">
          <Popover offset={12} placement="bottom-end">
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className="overflow-visible"
                radius="full"
                variant="light"
              >
                <Badge
                  color="danger"
                  content={notificationCount}
                  showOutline={false}
                  size="md"
                >
                  <Icon
                    className="text-default-500"
                    icon="solar:bell-linear"
                    width={22}
                  />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
              <NotificationsCard className="w-full shadow-none" />
            </PopoverContent>
          </Popover>
        </NavbarItem>
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="mt-1 h-8 w-fit transition-transform flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-800">
                  {userName}
                </span>
                <span className="inline-flex justify-center items-center size-3.5 rounded-full text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 transition-transform rotate-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userEmail}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {navItems?.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href={item.href} size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
