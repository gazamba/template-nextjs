import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "@/lib/env/server";

export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
});
