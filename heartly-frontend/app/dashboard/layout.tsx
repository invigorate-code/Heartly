import Header from "@/components/Header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { authApi } from "@/app/api/poc-api-using-api-util/auth";
import PopoverDrawer from "@/components/popoverActionButton/PopoverDrawer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await authApi.getLoggedInUser();

  return (
      <div className="flex flex-col h-dvh bg-[#f8f8f8]">
        <Header user={user} headerPurpose="dashboard" />
        <main className="flex flex-grow h-dvh">
          <Sidebar />
          <div className="lg:ps-[210px] flex-grow h-[92dvh] p-4">
            {children}
            <PopoverDrawer />
          </div>
        </main>
      </div>
  );
}
