"use strict";

const fs = require("fs");
const path = require("path");
const { TemplateHandler } = require("easy-template-x");
const { imageSize } = require("image-size");

const MAX_LOGO_WIDTH = 150;
const MAX_LOGO_HEIGHT = 60;

const MIME_MAP = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
};

function write(obj) {
  process.stdout.write(JSON.stringify(obj) + "\n");
}

function buildLogoDescriptor(logoPath) {
  if (!logoPath) return "";

  if (!fs.existsSync(logoPath)) {
    process.stderr.write(`[renderer] Warning: logo file not found: ${logoPath}\n`);
    return "";
  }

  const logoBuffer = fs.readFileSync(logoPath);
  const ext = path.extname(logoPath).toLowerCase();
  const mimeType = MIME_MAP[ext] || "image/png";

  let w = 100;
  let h = 100;
  try {
    const dims = imageSize(logoBuffer);
    w = dims.width || 100;
    h = dims.height || 100;
  } catch (err) {
    process.stderr.write(`[renderer] Warning: could not read logo dimensions: ${err.message}\n`);
  }

  const scale = Math.min(MAX_LOGO_WIDTH / w, MAX_LOGO_HEIGHT / h);

  return {
    _type: "image",
    source: logoBuffer,
    format: mimeType,
    width: Math.round(w * scale),
    height: Math.round(h * scale),
  };
}

async function main() {
  const contextPath = process.argv[2];

  if (!contextPath) {
    write({ success: false, error: "No context file path provided as argument" });
    process.exit(1);
  }

  // --- Read and parse context JSON ---
  let context;
  try {
    const raw = fs.readFileSync(contextPath, "utf8");
    context = JSON.parse(raw);
  } catch (err) {
    write({ success: false, error: `Failed to read context file: ${err.message}` });
    process.exit(1);
  }

  const { template, output, placeholders, logo } = context;

  // --- Validate required fields ---
  if (!template) {
    write({ success: false, error: "Context missing required field: template" });
    process.exit(1);
  }
  if (!output) {
    write({ success: false, error: "Context missing required field: output" });
    process.exit(1);
  }
  if (!placeholders || typeof placeholders !== "object") {
    write({ success: false, error: "Context missing required field: placeholders (must be an object)" });
    process.exit(1);
  }

  // --- Check template file exists ---
  if (!fs.existsSync(template)) {
    write({ success: false, error: `Template not found: ${template}` });
    process.exit(1);
  }

  // --- Build templateData ---
  // Copy all string/number placeholders from context.
  // Logo is handled separately because it requires binary processing.
  const templateData = {};
  for (const [key, value] of Object.entries(placeholders)) {
    templateData[key] = value ?? "";
  }

  templateData.Logo = buildLogoDescriptor(logo || null);

  // --- Load template and render ---
  let resultBuffer;
  try {
    const templateBuffer = fs.readFileSync(template);
    const handler = new TemplateHandler();
    resultBuffer = await handler.process(templateBuffer, templateData);
  } catch (err) {
    // Clean up context file before exiting on render error
    try { fs.unlinkSync(contextPath); } catch (_) {}
    write({ success: false, error: `Rendering failed: ${err.message}` });
    process.exit(1);
  }

  // --- Write output DOCX ---
  try {
    fs.writeFileSync(output, Buffer.from(resultBuffer));
  } catch (err) {
    try { fs.unlinkSync(contextPath); } catch (_) {}
    write({ success: false, error: `Failed to write output file: ${err.message}` });
    process.exit(1);
  }

  // --- Cleanup temp context file ---
  try { fs.unlinkSync(contextPath); } catch (_) {}

  write({ success: true, output: output });
  process.exit(0);
}

main().catch((err) => {
  write({ success: false, error: err.message || String(err) });
  process.exit(1);
});
