import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/index.tsx", [
    index("routes/index.home.tsx"),
    route("stats", "routes/index.stats.tsx"),
    route("transactions", "routes/index.transaction.tsx"),
    route("settings", "routes/index.setting.tsx"),
  ]),
  route("api/category", "routes/api.category.ts"),
] satisfies RouteConfig;
