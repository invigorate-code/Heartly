"use client";

import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useLoading } from "@/shared/context/LoadingContext";
import { addToast } from "@heroui/toast";

const StaffInvitePage = () => {
  const [staffEmail, setStaffEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [facility, setFacility] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>(
    []
  );
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [owner, setOwner] = useState<{
    id: string;
    email: string;
    auth_id: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const { showLoading, hideLoading } = useLoading();
  useEffect(() => {
    const getUserAndFacilities = async () => {
      showLoading();
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", JSON.stringify(userError));
        addToast({
          title: "Error",
          description: "Error getting user:",
          color: "danger",
        });
        return;
      }

      type UserFacilityFunctionReturn = {
        facilities: {
          facility_id: string;
          facility_name: string;
          facility_address: string;
          facility_city: string;
          facility_state: string;
          facility_zip: string;
          facility_projected_client_count: number;
        }[];
        tenant_id: string;
        up_user_id: string;
        user_auth_id: string;
        user_email: string;
      };

      const {
        data: userFacilityFunctionReturn,
        error: userFacilityFunctionError,
      } = await supabase
        .schema("api")
        .rpc("get_user_and_facilities", {
          user_id_param: user.user.id,
        })
        .single<UserFacilityFunctionReturn>();

      if (userFacilityFunctionError) {
        console.error(
          "Error getting facilities:",
          JSON.stringify(userFacilityFunctionError)
        );
        addToast({
          title: "Error",
          description: "Error getting facilities:",
          color: "danger",
        });
        return;
      }

      const { tenant_id, facilities, user_email, up_user_id, user_auth_id } =
        userFacilityFunctionReturn;

      setTenantId(tenant_id);
      setOwner({ id: up_user_id, email: user_email, auth_id: user_auth_id });

      const allFacilities = facilities.map((facility) => ({
        id: facility.facility_id,
        name: facility.facility_name,
        address: facility.facility_address,
        city: facility.facility_city,
        state: facility.facility_state,
        zip: facility.facility_zip,
        tenant_id: tenant_id,
        projected_client_count: facility.facility_projected_client_count,
      }));

      setFacilities(allFacilities);
      hideLoading();
    };

    getUserAndFacilities();
  }, []);

  const handleSkip = async () => {
    setIsLoading(true);
    if (!owner) {
      console.error("Owner not found");
      addToast({
        title: "Error",
        description: "Owner not found",
        color: "danger",
      });
      return;
    }

    const { error: updateUserError } = await supabase
      .schema("api")
      .from("user_profile")
      .update({ onboarding_completed: true })
      .eq("auth_user_id", owner.auth_id);

    if (updateUserError) {
      console.error("Error updating user:", JSON.stringify(updateUserError));
      addToast({
        title: "Error",
        description: "Error updating user:",
        color: "danger",
      });
      return;
    }

    redirect("/");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Validation: Check if all fields are filled
    if (!staffEmail || !firstName || !lastName || !role || !facility) {
      addToast({
        title: "Error",
        description: "Please fill in all fields before proceeding.",
        color: "danger",
        variant: "solid",
      });
      setIsLoading(false);
      return;
    }

    fetch("/api/invite-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: staffEmail,
        first_name: firstName,
        last_name: lastName,
        tenant_id: tenantId,
        facility_id: facility,
        app_role: role,
      }),
    })
      .then(async (response) => {
        console.log("response", await response.json());
        addToast({
          title: "Success",
          description: "User invited successfully",
          color: "success",
        });
      })
      .catch((error) => {
        console.error("error", error);
        addToast({
          title: "Error",
          description: "Error inviting user:",
          color: "danger",
        });
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
        redirect("/");
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] w-full items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col">
          <p className="text-3xl font-medium">Send Invite</p>
          <p className="text-sm font-extralight">Add at least one staff</p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Input
              aria-label="First Name"
              name="first_name"
              placeholder="First Name"
              type="text"
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              aria-label="Last Name"
              name="last_name"
              placeholder="Last Name"
              type="text"
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            aria-label="Staff Email"
            name="staffEmail"
            placeholder="Staff Email"
            type="email"
            value={staffEmail || ""}
            onChange={(e) => setStaffEmail(e.target.value)}
            radius="lg"
          />
          <Select
            aria-label="Role"
            placeholder="Select a role"
            value={role || ""}
            onChange={(e) => setRole(e.target.value)}
          >
            <SelectItem key="admin">Administrator</SelectItem>
            <SelectItem key="staff">Direct Support Staff</SelectItem>
          </Select>

          <Select
            aria-label="Facility"
            placeholder="Select a facility"
            value={facility || ""}
            onChange={(e) => setFacility(e.target.value)}
          >
            {facilities?.map((facility: { id: string; name: string }) => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.name}
              </SelectItem>
            ))}
          </Select>
          <div className="flex gap-3">
            <Button
              variant="faded"
              className="w-full text-primary"
              onPress={handleSkip}
            >
              Skip
            </Button>
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="text-white w-full"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffInvitePage;
