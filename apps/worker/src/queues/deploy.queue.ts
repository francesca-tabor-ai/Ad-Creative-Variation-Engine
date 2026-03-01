import { Queue } from "bullmq";

export const DEPLOY_QUEUE_NAME = "deploy";

export type DeployJobData = {
  assetId: string;
  campaignId: string;
  platform: string;
};

let deployQueue: Queue<DeployJobData> | null = null;

export function getDeployQueue(connection: { host: string; port: number }): Queue<DeployJobData> {
  if (!deployQueue) {
    deployQueue = new Queue<DeployJobData>(DEPLOY_QUEUE_NAME, { connection });
  }
  return deployQueue;
}
