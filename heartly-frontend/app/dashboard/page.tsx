import { redirect } from "next/navigation";
import { authApi } from "@/app/api/poc-api-using-api-util/auth";

export default async function Dashboard() {
  const user = await authApi.getLoggedInUser();

  console.log("user from dashboard", user);

  if (!user) {
    return redirect("/login");
  }

  redirect("/dashboard/home");
}
