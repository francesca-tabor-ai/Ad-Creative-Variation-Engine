import { Worker } from "bullmq";
import { RENDER_QUEUE_NAME } from "./queues/render.queue";
import { DEPLOY_QUEUE_NAME } from "./queues/deploy.queue";
import { INGEST_QUEUE_NAME } from "./queues/ingest.queue";
import { processRenderJob } from "./processors/render.processor";
import { processDeployJob } from "./processors/deploy.processor";
import { processIngestJob } from "./processors/ingest.processor";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || "6379", 10),
  };
}

async function main() {
  const connection = parseRedisUrl(REDIS_URL);

  console.log(`[worker] Connecting to Redis at ${connection.host}:${connection.port}`);

  const renderWorker = new Worker(RENDER_QUEUE_NAME, processRenderJob, {
    connection,
    concurrency: 5,
  });

  const deployWorker = new Worker(DEPLOY_QUEUE_NAME, processDeployJob, {
    connection,
    concurrency: 3,
  });

  const ingestWorker = new Worker(INGEST_QUEUE_NAME, processIngestJob, {
    connection,
    concurrency: 2,
  });

  console.log("[worker] All workers started");

  const shutdown = async () => {
    console.log("[worker] Shutting down...");
    await Promise.all([renderWorker.close(), deployWorker.close(), ingestWorker.close()]);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[worker] Fatal error:", err);
  process.exit(1);
});
