import { Queue } from "bullmq";
import type { CreateRenderJobInput } from "@acve/shared";

export const RENDER_QUEUE_NAME = "render";

export type RenderJobData = CreateRenderJobInput & {
  campaignId: string;
};

let renderQueue: Queue<RenderJobData> | null = null;

export function getRenderQueue(connection: { host: string; port: number }): Queue<RenderJobData> {
  if (!renderQueue) {
    renderQueue = new Queue<RenderJobData>(RENDER_QUEUE_NAME, { connection });
  }
  return renderQueue;
}
