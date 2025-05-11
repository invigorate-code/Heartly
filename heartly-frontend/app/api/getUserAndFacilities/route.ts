import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  console.log("get user and facilities called");
  //   try {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  console.log("user", user);

  if (userError) {
    console.error("Error getting user:", JSON.stringify(userError));
    return NextResponse.json({ error: "Error getting user" }, { status: 500 });
  }

  //     type UserFacilityFunctionReturn = {
  //       facilities: {
  //         facility_id: string;
  //         facility_name: string;
  //         facility_address: string;
  //         facility_city: string;
  //         facility_state: string;
  //         facility_zip: string;
  //         facility_projected_client_count: number;
  //       }[];
  //       tenant_id: string;
  //       up_user_id: string;
  //       user_auth_id: string;
  //       user_email: string;
  //     };

  //     const {
  //       data: userFacilityFunctionReturn,
  //       error: userFacilityFunctionError,
  //     } = await supabase
  //       .schema("api")
  //       .rpc("get_user_and_facilities", {
  //         user_id_param: user.user.id,
  //       })
  //       .single<UserFacilityFunctionReturn>();

  //     if (userFacilityFunctionError) {
  //       console.error(
  //         "Error getting facilities:",
  //         JSON.stringify(userFacilityFunctionError)
  //       );
  //       return NextResponse.json(
  //         { error: "Error getting facilities" },
  //         { status: 500 }
  //       );
  //     }

  //     console.log("userFacilityFunctionReturn", userFacilityFunctionReturn);

  //     const { tenant_id, facilities, user_email, up_user_id, user_auth_id } =
  //       userFacilityFunctionReturn;

  //     const allFacilities = facilities.map((facility) => ({
  //       id: facility.facility_id,
  //       name: facility.facility_name,
  //       address: facility.facility_address,
  //       city: facility.facility_city,
  //       state: facility.facility_state,
  //       zip: facility.facility_zip,
  //       tenant_id: tenant_id,
  //       projected_client_count: facility.facility_projected_client_count,
  //     }));

  //     return NextResponse.json({
  //       tenantId: tenant_id,
  //       owner: { id: up_user_id, email: user_email, auth_id: user_auth_id },
  //       facilities: allFacilities,
  //     });
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  //   }
  return NextResponse.json({ user: user.user.id });
}
