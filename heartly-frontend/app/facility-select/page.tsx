"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useFacility } from "@/shared/context/FacilityContext";
import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";

export default function FacilitySelectPage() {
  const { facilities, selectFacility, selectedFacility, loading } =
    useFacility();
  const router = useRouter();

  useEffect(() => {
    // If only one facility and it's selected, redirect to dashboard
    if (facilities.length === 1 && selectedFacility) {
      router.push("/dashboard");
    }
  }, [facilities, selectedFacility, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" label="Loading facilities..." />
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="flex gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <p className="text-lg font-bold">No Facilities Available</p>
              <p className="text-small text-default-500">
                You don't have access to any facilities
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <p>
              Please contact your administrator to get access to facilities.
            </p>
            <Button
              color="primary"
              className="mt-4"
              onClick={() => router.push("/logout")}
            >
              Logout
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-xl w-full">
        <CardHeader className="flex gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <p className="text-lg font-bold">Select a Facility</p>
            <p className="text-small text-default-500">
              Choose which facility you want to access
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            {facilities.map((facility) => (
              <Button
                key={facility.id}
                className="h-24 flex flex-col items-start p-4 text-left"
                color="default"
                variant={
                  selectedFacility?.id === facility.id ? "flat" : "bordered"
                }
                onPress={() => selectFacility(facility.id)}
              >
                <span className="font-bold">{facility.name}</span>
                <span className="text-small text-default-500">
                  {facility.address}
                </span>
                <span className="text-tiny text-default-400 truncate w-full">
                  {facility.address}
                </span>
              </Button>
            ))}
          </div>

          <Button
            color="primary"
            className="mt-6 w-full"
            onPress={() => router.push("/dashboard")}
            disabled={!selectedFacility}
          >
            Continue to Dashboard
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
