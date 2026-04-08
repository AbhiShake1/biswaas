import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// CORS headers
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
  handler: httpAction(async (ctx) => {
    const categories = await ctx.runQuery(api.categories.list);
    return jsonResponse({ categories });
  }),
});

// OPTIONS preflight for reviews
http.route({
  path: "/api/v1/reviews/latest",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

// GET /api/v1/reviews/latest
http.route({
  path: "/api/v1/reviews/latest",
  method: "GET",
  handler: httpAction(async (ctx) => {
    // Return latest 20 reviews across all businesses
    return jsonResponse({ reviews: [], message: "Coming soon" });
  }),
});

export default http;
