export const conversionRules = {
  pdf: ["html", "markdown", "text"],
  markdown: ["html", "pdf"],
  html: ["pdf", "markdown"],
  csv: ["json", "xlsx"],
  json: ["csv", "toml", "yaml", "ini", "xml", "ndjson"],
  yaml: ["json"],
  ini: ["json"],
  xml: ["json"],
  ndjson: ["json"],
  png: ["jpg", "webp"],
  jpg: ["png", "webp"],
  webp: ["png", "jpg"],
} as const;
