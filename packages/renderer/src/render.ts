import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { getBuiltInTemplate } from "./templates";

export interface VariantContent {
  headline?: string;
  primaryText?: string;
  description?: string;
  callToAction?: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface TemplateConfig {
  components?: {
    layers?: Array<{
      type: string;
      name: string;
      field?: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    backgroundColor?: string;
    width?: number;
    height?: number;
  };
  constraints?: {
    maxHeadlineLength?: number;
    maxPrimaryTextLength?: number;
    fonts?: string[];
  };
  platform: string;
  format: string;
}

export interface RenderInput {
  template: TemplateConfig;
  content: VariantContent;
  format: string;
  outputFormat?: "png" | "jpeg" | "webp";
}

export interface RenderOutput {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  fileSizeBytes: number;
}

const FORMAT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1080, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1.91:1": { width: 1200, height: 628 },
};

// Satori uses React-like virtual DOM objects but not actual ReactNode types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SatoriNode = any;

/**
 * Render a creative variant into an image buffer.
 * Uses Satori (JSX → SVG) + resvg (SVG → PNG) + sharp (resize/convert).
 */
export async function renderVariant(input: RenderInput): Promise<RenderOutput> {
  const { template, content, format, outputFormat = "png" } = input;

  // Determine dimensions
  const dims = FORMAT_DIMENSIONS[format] || { width: 1080, height: 1080 };
  const width = template.components?.width || dims.width;
  const height = template.components?.height || dims.height;

  // Build the JSX tree from template + content
  const jsx = buildJsx(template, content, width, height);

  // Render JSX → SVG via Satori
  const svg = await satori(jsx, {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: await loadDefaultFont(),
        weight: 400,
        style: "normal" as const,
      },
      {
        name: "Inter",
        data: await loadDefaultFont(),
        weight: 700,
        style: "normal" as const,
      },
    ],
  });

  // SVG → PNG via resvg
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width" as const, value: width },
  });
  const pngData = resvg.render();
  let buffer: Buffer = Buffer.from(pngData.asPng());

  // Convert format if needed
  let mimeType = "image/png";
  if (outputFormat === "jpeg") {
    buffer = Buffer.from(await sharp(buffer).jpeg({ quality: 90 }).toBuffer());
    mimeType = "image/jpeg";
  } else if (outputFormat === "webp") {
    buffer = Buffer.from(await sharp(buffer).webp({ quality: 90 }).toBuffer());
    mimeType = "image/webp";
  }

  return {
    buffer,
    mimeType,
    width,
    height,
    fileSizeBytes: buffer.byteLength,
  };
}

/**
 * Build React-like JSX for Satori from template layers + variant content.
 */
function buildJsx(
  template: TemplateConfig,
  content: VariantContent,
  width: number,
  height: number,
): SatoriNode {
  const bgColor = template.components?.backgroundColor || "#ffffff";
  const layers = template.components?.layers || [];

  // If no layers, use a built-in template
  if (layers.length === 0) {
    const builtIn = getBuiltInTemplate(template.platform, template.format);
    if (builtIn) {
      return builtIn(content, width, height);
    }
  }

  // Build layer-based layout
  const children: SatoriNode[] = [];

  for (const layer of layers) {
    const value = layer.field ? content[layer.field as keyof VariantContent] : undefined;

    if (layer.type === "text" && value) {
      children.push({
        type: "div",
        key: layer.name,
        props: {
          style: {
            position: "absolute",
            left: layer.x,
            top: layer.y,
            width: layer.width,
            height: layer.height,
            display: "flex",
            alignItems: "center",
            fontSize: layer.field === "headline" ? 36 : layer.field === "callToAction" ? 20 : 18,
            fontWeight: layer.field === "headline" ? 700 : layer.field === "callToAction" ? 600 : 400,
            color: "#111111",
            overflow: "hidden",
          },
          children: String(value),
        },
      });
    } else if (layer.type === "image" && value) {
      children.push({
        type: "div",
        key: layer.name,
        props: {
          style: {
            position: "absolute",
            left: layer.x,
            top: layer.y,
            width: layer.width,
            height: layer.height,
            backgroundColor: "#e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            color: "#6b7280",
          },
          children: "Image placeholder",
        },
      });
    } else if (layer.type === "shape") {
      children.push({
        type: "div",
        key: layer.name,
        props: {
          style: {
            position: "absolute",
            left: layer.x,
            top: layer.y,
            width: layer.width,
            height: layer.height,
            backgroundColor: "#f3f4f6",
            borderRadius: 8,
          },
        },
      });
    }
  }

  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        backgroundColor: bgColor,
        position: "relative",
        display: "flex",
        fontFamily: "Inter",
      },
      children,
    },
  };
}

/**
 * Load a default font for Satori. In production, bundle actual font files.
 */
async function loadDefaultFont(): Promise<ArrayBuffer> {
  try {
    const response = await fetch(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
    );
    return await response.arrayBuffer();
  } catch {
    return new ArrayBuffer(0);
  }
}
