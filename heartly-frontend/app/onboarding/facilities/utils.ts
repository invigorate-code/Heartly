import { Facility } from "@/utils/supabase/db-model.ts";
import { componentFacility } from "./model.ts";

export const validateFacility = (data: componentFacility) => {
  const errors: Record<string, string> = {};
  if (!data.name) {
    errors.facilityName = "Facility Name is required";
  }
  if (!data.address) {
    errors.address = "Address is required";
  }
  if (!data.city) {
    errors.city = "City is required";
  }
  if (!data.state) {
    errors.state = "State is required";
  }
  if (!data.zip) {
    errors.zip = "Zip Code is required";
  }
  if (!data.projected_client_count) {
    errors.projected_client_count = "Amount of Clients is required";
  }
  return errors;
};
