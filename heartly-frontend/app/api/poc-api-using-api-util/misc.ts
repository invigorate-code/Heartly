// import { createClient } from "@/utils/supabase/server.ts";

// export const MiscApi = {
//   createUserProfileAndAddToTenantAndFacility: async (
//     user_id: string,
//     tenant_id: string,
//     facility_id: string
//   ) => {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .schema("api")
//       .rpc("create_user_profile_and_add_to_tenant_and_facility", {
//         user_id_parm: user_id,
//         tenant_id: tenant_id,
//         facility_id: facility_id,
//       });

//     if (error) {
//       throw new Error(error.message);
//     }

//     return data;
//   },
// };
