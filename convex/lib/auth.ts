import { QueryCtx, MutationCtx } from "../_generated/server";
import { ConvexError } from "convex/values";

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
