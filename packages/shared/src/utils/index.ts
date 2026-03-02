import { nanoid } from "nanoid";

export * from "./governance";

export function generateId(prefix?: string): string {
  const id = nanoid(21);
  return prefix ? `${prefix}_${id}` : id;
}

export function generateCampaignId(): string {
  return generateId("cmp");
}

export function generateVariantId(): string {
  return generateId("var");
}

export function generateTemplateId(): string {
  return generateId("tpl");
}

export function generateRenderJobId(): string {
  return generateId("rnd");
}

export function generateAssetId(): string {
  return generateId("ast");
}

export function centsToDisplay(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
