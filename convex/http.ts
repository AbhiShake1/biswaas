import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders() });
}

// OPTIONS preflight
http.route({
  path: "/api/v1/businesses",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

// GET /api/v1/businesses?slug=xxx or ?search=xxx
http.route({
  path: "/api/v1/businesses",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    const search = url.searchParams.get("search");

    if (slug) {
      const business = await ctx.runQuery(api.businesses.getBySlug, { slug });
      if (!business) {
        return jsonResponse({ error: "Business not found" }, 404);
      }
      return jsonResponse({ business });
    }

    const featured = url.searchParams.get("featured");
    if (featured) {
      const limit = Number(url.searchParams.get("limit") ?? "6");
      const businesses = await ctx.runQuery(api.businesses.listFeatured, { limit });
      return jsonResponse({ businesses });
    }

    if (search) {
      const businesses = await ctx.runQuery(api.businesses.search, { query: search });
      return jsonResponse({ businesses });
    }

    return jsonResponse({ error: "Provide ?slug= or ?search= parameter" }, 400);
  }),
});

// OPTIONS preflight for categories
http.route({
  path: "/api/v1/categories",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

// GET /api/v1/categories
http.route({
  path: "/api/v1/categories",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      const category = await ctx.runQuery(api.categories.getBySlug, { slug });
      if (!category) {
        return jsonResponse({ error: "Category not found" }, 404);
      }
      return jsonResponse({ category });
    }

    const categories = await ctx.runQuery(api.categories.list);
    return jsonResponse({ categories });
  }),
});

// OPTIONS preflight for reviews
http.route({
  path: "/api/v1/reviews",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

// GET /api/v1/reviews?businessSlug=...
http.route({
  path: "/api/v1/reviews",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const businessSlug = url.searchParams.get("businessSlug");

    if (!businessSlug) {
      return jsonResponse({ error: "Provide ?businessSlug= parameter" }, 400);
    }

    const business = await ctx.runQuery(api.businesses.getBySlug, { slug: businessSlug });
    if (!business) {
      return jsonResponse({ error: "Business not found" }, 404);
    }

    const reviews = await ctx.runQuery(api.reviews.listByBusiness, {
      businessId: business._id,
    });

    return jsonResponse({ reviews: reviews.items });
  }),
});

http.route({
  path: "/api/v1/reviews",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const reviewId = await ctx.runMutation(api.reviews.createFromSession, {
      businessSlug: body.businessSlug,
      stars: body.stars,
      title: body.title,
      body: body.body,
      user: body.user,
      language: body.language,
    });

    return jsonResponse({ reviewId }, 201);
  }),
});

http.route({
  path: "/api/v1/reviews/reply",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/api/v1/reviews/reply",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const reviewId = await ctx.runMutation(api.reviews.replyFromSession, {
      reviewId: body.reviewId,
      body: body.body,
      user: body.user,
    });

    return jsonResponse({ reviewId }, 201);
  }),
});

export default http;
