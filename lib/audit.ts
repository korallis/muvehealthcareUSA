import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { headers } from "next/headers";

interface AuditEntry {
  userId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(entry: AuditEntry): Promise<void> {
  try {
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    await db.insert(auditLogs).values({
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      ipAddress,
      userAgent,
      metadata: entry.metadata,
    });
  } catch (error) {
    // Audit logging should never break the main flow
    console.error("[Audit Log Error]", error);
  }
}
