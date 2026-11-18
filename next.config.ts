import type { NextConfig } from "next";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "deadlock_super_secret_jwt_key_2026_unbreakable_shackle";
}
if (!process.env.ADMIN_EMAIL) {
  process.env.ADMIN_EMAIL = "admin@deadlock.studio";
}
if (!process.env.ADMIN_PASSWORD) {
  process.env.ADMIN_PASSWORD = "deadlock2026!";
}

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
