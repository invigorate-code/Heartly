import React from "react";
import { useUser } from "@/shared/context/UserContext";

// I want to add nav guard property here for user role.

type NavItem = {
  href: string;
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  guard: (userRole: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard/home",
    label: "Dashboard",
    icon: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    guard: (userRole) => userRole === "owner",
  },
  {
    href: "/dashboard/clients",
    label: "Clients",
    icon: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    guard: (userRole) => userRole === "owner",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    guard: (userRole) => userRole === "owner",
  },
  {
    href: "/dashboard/facilities",
    label: "Facilities",
    icon: (props) => (
      <svg
        {...props}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2.5"
          y="5.83334"
          width="15"
          height="10.8333"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66669 5.83333V4.16667C6.66669 3.24619 7.41288 2.5 8.33335 2.5H11.6667C12.5872 2.5 13.3334 3.24619 13.3334 4.16667V5.83333"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99998 9.99999V10.0083"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 10.8333C7.21746 13.2105 12.7825 13.2105 17.5 10.8333"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    guard: (userRole) => userRole === "owner",
  },
];

const SidebarNavItems = () => {
  const { getUserRole } = useUser();
  const userRole = getUserRole();

  console.log(userRole);

  if (!userRole) {
    return null;
  }

  return NAV_ITEMS.filter((item) => item.guard(userRole));
};

export default SidebarNavItems;
