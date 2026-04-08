import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env/server";

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
