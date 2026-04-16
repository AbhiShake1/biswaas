import type { QueryCtx, MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";
import { now } from "./time";

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q) => q.eq("workosId", identity.subject))
    .unique();

  return user;
}

export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new ConvexError("Unauthorized");
  return user;
}

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  roles: string[]
) {
  const user = await requireUser(ctx);
  if (!roles.includes(user.role)) {
    throw new ConvexError("Forbidden: insufficient role");
  }
  return user;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  return requireRole(ctx, ["admin"]);
}

export async function getOrCreateAuthUser(
  ctx: MutationCtx,
  profile: { email: string; name: string; avatarUrl?: string }
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Unauthorized");

  const workosId = identity.subject;

  const existingByWorkosId = await ctx.db
    .query("users")
    .withIndex("by_workosId", (q) => q.eq("workosId", workosId))
    .unique();
  if (existingByWorkosId) return existingByWorkosId;

  const existingByEmail = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", profile.email))
    .unique();
  if (existingByEmail) {
    await ctx.db.patch(existingByEmail._id, {
      workosId,
      name: profile.name,
      updatedAt: now(),
    });
    return { ...existingByEmail, workosId, name: profile.name };
  }

  const userId = await ctx.db.insert("users", {
    workosId,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    role: "consumer",
    reviewCount: 0,
    isVerified: false,
    language: "en",
    createdAt: now(),
    updatedAt: now(),
  });

  return (await ctx.db.get(userId))!;
}
