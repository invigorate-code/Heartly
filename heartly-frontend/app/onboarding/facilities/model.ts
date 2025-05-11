import { Facility } from "@/utils/supabase/db-model.ts";

export const facilityTableColumns = [
  {
    key: "facilityName",
    label: "Facility Name",
  },
  {
    key: "address",
    label: "Address",
  },
  {
    key: "city",
    label: "City",
  },
  {
    key: "state",
    label: "State",
  },
  {
    key: "zipCode",
    label: "Zip Code",
  },
  {
    key: "amountOfClients",
    label: "Amount of Clients",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export type componentFacility = Omit<Facility, "created_at" | "updated_at"> & {
  created_at?: string;
  updated_at?: string;
};

export type FacilityWithoutId = Omit<componentFacility, "id">;
