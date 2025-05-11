// import { createClient } from "@/utils/supabase/server";
// import { Database } from "@/types_db";

// export const facilityApi = {
//   getFacilities: async () => {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .schema("api")
//       .from("facility")
//       .select("*");

//     if (error) {
//       throw new Error(error.message);
//     }
//     return data;
//   },

//   getFacility: async (id: string) => {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .schema("api")
//       .from("facility")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }
//     return data;
//   },

//   createFacility: async (
//     data: Database["api"]["Tables"]["facility"]["Insert"]
//   ) => {
//     const supabase = await createClient();
//     const { data: created, error } = await supabase
//       .schema("api")
//       .from("facility")
//       .insert([data])
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }
//     return created;
//   },

//   updateFacility: async (
//     id: string,
//     data: Partial<Database["api"]["Tables"]["facility"]["Row"]>
//   ) => {
//     const supabase = await createClient();
//     const { data: updated, error } = await supabase
//       .schema("api")
//       .from("facility")
//       .update(data)
//       .eq("id", id)
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }
//     return updated;
//   },

//   deleteFacility: async (id: string) => {
//     const supabase = await createClient();
//     const { data: deleted, error } = await supabase
//       .schema("api")
//       .from("facility")
//       .delete()
//       .eq("id", id)
//       .single();

//     if (error) {
//       throw new Error(error.message);
//     }
//     return deleted;
//   },
// };
