import { savePageAction } from "@/lib/actions/editor";
import { NextResponse } from "next/server";

import { authGuard } from "@/lib/authGuard";

export async function POST(req: Request) {
  try {
    await authGuard("admin");
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, data } = await req.json();
  await savePageAction(slug, data);
  return NextResponse.json({ success: true });
}
