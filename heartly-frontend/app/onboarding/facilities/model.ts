// TODO: Replace with proper type from backend API
export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  projected_client_count: number;
  tenant_id: string;
  created_at: Date;
  updated_at: Date;
}

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
