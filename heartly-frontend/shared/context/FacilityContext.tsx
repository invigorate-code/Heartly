"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type Facility = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
};

type FacilityContextType = {
  facilities: Facility[];
  selectedFacility: Facility | null;
  selectFacility: (facilityId: string) => void;
  loading: boolean;
};

const FacilityContext = createContext<FacilityContextType | undefined>(
  undefined
);

export function FacilityProvider({ children }: { children: ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // useEffect(() => {
  //   async function loadFacilities() {
  //     try {
  //       setLoading(true);

  //       // Get current user
  //       const user = await getCurrentUser();



  //       if (!user) {
  //         return;
  //       }

  //       const { data: userProfile, error: userProfileError } = await supabase
  //         .schema("api")
  //         .from("user_profile")
  //         .select("*")
  //         .eq("auth_user_id", user.id)
  //         .single();

  //       if (userProfileError) throw userProfileError;

  //       console.log("userProfile", userProfile);

  //       // Get facilities the user has access to
  //       // const { data, error } = await supabase
  //       //   .schema("api")
  //       //   .from("facility_user_profile")
  //       //   .select(
  //       //     `
  //       //     facility_id,
  //       //     facility(
  //       //       id,
  //       //       name,
  //       //       address,
  //       //       city,
  //       //       state,
  //       //       zip,
  //       //       tenant_id,
  //       //       created_at,
  //       //       updated_at
  //       //     )
  //       //   `
  //       //   )
  //       //   .eq("user_profile_id", user.id);

  //       // if (error) throw error;

  //       // const userFacilities = data.map((item) => item.facility);
  //       // if (userFacilities) {
  //       //   // Filter out any null values from the userFacilities array
  //       //   const validFacilities = userFacilities.filter(
  //       //     (facility) => facility !== null
  //       //   );

  //       //   // Directly set the filtered facilities
  //       //   // setFacilities(validFacilities);
  //       //   console.log("validFacilities", validFacilities);
  //       }

  //       // Check if a facility is already selected in localStorage
  //       const storedFacilityId = localStorage.getItem("selectedFacilityId");
  //       if (storedFacilityId) {
  //         const facility = userFacilities.find(
  //           (f) => f?.id === storedFacilityId
  //         );
  //         if (facility) {
  //           setSelectedFacility(facility);
  //         } else if (userFacilities.length > 0) {
  //           if (userFacilities[0]) {
  //             setSelectedFacility(userFacilities[0]);
  //             localStorage.setItem("selectedFacilityId", userFacilities[0].id);
  //           }
  //         }
  //       } else if (userFacilities.length > 0) {
  //         if (userFacilities[0]) {
  //           setSelectedFacility(userFacilities[0]);
  //           localStorage.setItem("selectedFacilityId", userFacilities[0].id);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error loading facilities:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadFacilities();
  // }, [router]);

  const selectFacility = (facilityId: string) => {
    const facility = facilities.find((f) => f.id === facilityId);
    if (facility) {
      setSelectedFacility(facility);
      localStorage.setItem("selectedFacilityId", facilityId);

      // If on facility selection page, redirect to dashboard
      if (pathname === "/facility-select") {
        router.push("/dashboard");
      }
    }
  };

  return (
    <FacilityContext.Provider
      value={{
        facilities,
        selectedFacility,
        selectFacility,
        loading,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacility() {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error("useFacility must be used within a FacilityProvider");
  }
  return context;
}

