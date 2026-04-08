import { inngest } from "@/lib/jobs/inngest";
import { logger } from "@/lib/logging/logger";

export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello.world" }],
  },
  async ({ event, step }) => {
    logger.info({ event: event.name }, "Received event");

    await step.sleep("wait-a-moment", "1s");

    return { message: `Hello ${event.data.email}!` };
  },
);
