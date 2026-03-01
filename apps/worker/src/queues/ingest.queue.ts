import { Queue } from "bullmq";

export const INGEST_QUEUE_NAME = "ingest";

export type IngestJobData = {
  campaignId: string;
  platform: string;
  dateRange: { start: string; end: string };
};

let ingestQueue: Queue<IngestJobData> | null = null;

export function getIngestQueue(connection: { host: string; port: number }): Queue<IngestJobData> {
  if (!ingestQueue) {
    ingestQueue = new Queue<IngestJobData>(INGEST_QUEUE_NAME, { connection });
  }
  return ingestQueue;
}
