import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  (req as any).userId = userId;
  next();
}

async function resolveUserEmail(auth: any): Promise<string> {
  const email = auth?.sessionClaims?.email
    || auth?.sessionClaims?.primary_email_address
    || "";
  if (email) return email;

  const userId = auth?.userId;
  if (!userId) return "";
  try {
    const resp = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });
    if (!resp.ok) return "";
    const user = (await resp.json()) as { email_addresses?: { id: string; email_address: string }[]; primary_email_address_id?: string };
    const primary = user.email_addresses?.find(
      (e: any) => e.id === user.primary_email_address_id
    );
    return primary?.email_address || user.email_addresses?.[0]?.email_address || "";
  } catch {
    return "";
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (ADMIN_EMAILS.length === 0) {
    return res.status(403).json({ error: "Forbidden: no admin configured" });
  }

  const email = await resolveUserEmail(auth);
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  (req as any).userId = userId;
  (req as any).userEmail = email;
  next();
}

export { resolveUserEmail };
