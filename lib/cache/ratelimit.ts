import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/cache/redis";

export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;
