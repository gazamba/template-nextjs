"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { clientEnv } from "@/lib/env/client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (clientEnv.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(clientEnv.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: clientEnv.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
      });
    }
  }, []);

  if (!clientEnv.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
