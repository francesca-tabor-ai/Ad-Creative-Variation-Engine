// Satori uses React-like virtual DOM objects but not actual ReactNode types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SatoriNode = any;

interface VariantContent {
  headline?: string;
  primaryText?: string;
  description?: string;
  callToAction?: string;
  imagePrompt?: string;
  imageUrl?: string;
}

type TemplateRenderer = (content: VariantContent, width: number, height: number) => SatoriNode;

/**
 * Built-in template renderers for common ad formats.
 * Used as fallback when no custom template layers are defined.
 */
const templates: Record<string, TemplateRenderer> = {
  "meta:1:1": metaFeedTemplate,
  "meta:4:5": metaFeedTemplate,
  "meta:9:16": metaStoryTemplate,
  "tiktok:9:16": metaStoryTemplate,
  "google:1.91:1": googleDisplayTemplate,
  "linkedin:1:1": metaFeedTemplate,
  "linkedin:1.91:1": googleDisplayTemplate,
};

export const BUILT_IN_TEMPLATES = Object.keys(templates);

export function getBuiltInTemplate(
  platform: string,
  format: string,
): TemplateRenderer | null {
  return templates[`${platform}:${format}`] || null;
}

/**
 * Standard feed ad: image area on top, text below.
 */
function metaFeedTemplate(content: VariantContent, width: number, height: number): SatoriNode {
  const imageHeight = Math.floor(height * 0.6);
  const padding = Math.floor(width * 0.04);

  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column" as const,
        fontFamily: "Inter",
      },
      children: [
        // Image area
        {
          type: "div",
          key: "image",
          props: {
            style: {
              width,
              height: imageHeight,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: "#9ca3af",
            },
            children: content.imageUrl || "Creative Image",
          },
        },
        // Text area
        {
          type: "div",
          key: "text",
          props: {
            style: {
              display: "flex",
              flexDirection: "column" as const,
              padding,
              flex: 1,
              justifyContent: "center",
              gap: 12,
            },
            children: [
              content.headline
                ? {
                    type: "div",
                    key: "headline",
                    props: {
                      style: {
                        fontSize: Math.floor(width * 0.033),
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.2,
                      },
                      children: content.headline,
                    },
                  }
                : null,
              content.primaryText
                ? {
                    type: "div",
                    key: "primaryText",
                    props: {
                      style: {
                        fontSize: Math.floor(width * 0.018),
                        color: "#4b5563",
                        lineHeight: 1.5,
                      },
                      children: content.primaryText,
                    },
                  }
                : null,
              content.callToAction
                ? {
                    type: "div",
                    key: "cta",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#111827",
                        color: "#ffffff",
                        borderRadius: 8,
                        padding: "12px 24px",
                        fontSize: Math.floor(width * 0.018),
                        fontWeight: 600,
                        alignSelf: "flex-start",
                      },
                      children: content.callToAction,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

/**
 * Story/vertical format: full-bleed with text overlay.
 */
function metaStoryTemplate(content: VariantContent, width: number, height: number): SatoriNode {
  const padding = Math.floor(width * 0.06);

  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        backgroundColor: "#1a1a2e",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "flex-end",
        padding,
        fontFamily: "Inter",
      },
      children: [
        content.headline
          ? {
              type: "div",
              key: "headline",
              props: {
                style: {
                  fontSize: Math.floor(width * 0.055),
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  marginBottom: 16,
                },
                children: content.headline,
              },
            }
          : null,
        content.primaryText
          ? {
              type: "div",
              key: "primaryText",
              props: {
                style: {
                  fontSize: Math.floor(width * 0.028),
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.5,
                  marginBottom: 24,
                },
                children: content.primaryText,
              },
            }
          : null,
        content.callToAction
          ? {
              type: "div",
              key: "cta",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  color: "#1a1a2e",
                  borderRadius: 12,
                  padding: "16px 32px",
                  fontSize: Math.floor(width * 0.028),
                  fontWeight: 600,
                  marginBottom: 48,
                },
                children: content.callToAction,
              },
            }
          : null,
      ].filter(Boolean),
    },
  };
}

/**
 * Wide display ad: horizontal layout with image left, text right.
 */
function googleDisplayTemplate(content: VariantContent, width: number, height: number): SatoriNode {
  const padding = Math.floor(height * 0.08);

  return {
    type: "div",
    props: {
      style: {
        width,
        height,
        backgroundColor: "#ffffff",
        display: "flex",
        fontFamily: "Inter",
      },
      children: [
        // Image area (left half)
        {
          type: "div",
          key: "image",
          props: {
            style: {
              width: Math.floor(width * 0.45),
              height,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#9ca3af",
            },
            children: "Image",
          },
        },
        // Text area (right)
        {
          type: "div",
          key: "text",
          props: {
            style: {
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "center",
              padding,
              flex: 1,
              gap: 10,
            },
            children: [
              content.headline
                ? {
                    type: "div",
                    key: "headline",
                    props: {
                      style: {
                        fontSize: Math.floor(height * 0.06),
                        fontWeight: 700,
                        color: "#111827",
                        lineHeight: 1.2,
                      },
                      children: content.headline,
                    },
                  }
                : null,
              content.primaryText
                ? {
                    type: "div",
                    key: "primaryText",
                    props: {
                      style: {
                        fontSize: Math.floor(height * 0.035),
                        color: "#4b5563",
                        lineHeight: 1.4,
                      },
                      children: content.primaryText,
                    },
                  }
                : null,
              content.callToAction
                ? {
                    type: "div",
                    key: "cta",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        borderRadius: 6,
                        padding: "10px 20px",
                        fontSize: Math.floor(height * 0.035),
                        fontWeight: 600,
                        alignSelf: "flex-start",
                      },
                      children: content.callToAction,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}
