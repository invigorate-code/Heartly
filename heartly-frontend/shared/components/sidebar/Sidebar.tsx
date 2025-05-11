"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import SidebarNavItems from "@/shared/components/sidebar/navitems.tsx";

const Sidebar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navItems = SidebarNavItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      id="hs-pro-sidebar"
      data-testid="sidebar"
      className={`hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform
              w-[210px]
              hidden
              fixed inset-y-0 z-[60] h-full
              bg-white lg:bg-transparent
              lg:block lg:translate-x-0 lg:inset-y-auto ${
                isScrolled ? "mt-10" : ""
              }
            `}
    >
      <div className="flex flex-col h-full max-h-full">
        <div className="h-screen lg:h-[calc(100%-118px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          <nav
            className="hs-accordion-group p-4 pl-0 w-full flex flex-col flex-wrap space-y-4"
            data-hs-accordion-always-open
          >
            <ul className="space-y-2">
              {navItems?.map((item) => (
                <li
                  key={item.href}
                  className={
                    item.href === "/dashboard/clients" ? "hs-accordion" : ""
                  }
                >
                  <Link
                    href={item.href}
                    className={`w-full text-sm text-start flex gap-x-3 p-3 text-gray-800 rounded-r-lg hover:bg-secondary hover:text-white disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:text-white dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700 ${
                      pathname === item.href ? "bg-secondary text-white" : ""
                    }`}
                  >
                    <item.icon className="flex-shrink-0 mt-1 size-3.5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="lg:hidden absolute top-3 -end-3 z-10">
          <button
            type="button"
            className="w-6 h-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ecrbrand-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            data-hs-overlay="#hs-pro-sidebar"
            aria-controls="hs-pro-sidebar"
            aria-label="Toggle navigation"
          >
            <svg
              className="flex-shrink-0 size-4"
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
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
