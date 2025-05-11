import { NextRequest, NextResponse } from "next/server";
import { getSession } from "supertokens-node/recipe/session";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const session = await getSession(request, {
    sessionRequired: false,
  });
  const path = params.path.join("/");
  
  try {
    const response = await fetch(`${process.env.NEST_API_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${session?.getAccessToken()}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
