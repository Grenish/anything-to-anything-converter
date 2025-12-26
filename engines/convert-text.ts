import { parse as parseCSV } from "csv-parse/sync";
import { stringify as stringifyCSV } from "csv-stringify/sync";
import * as toml from "@iarna/toml";
import * as yaml from "js-yaml";
import * as ini from "ini";
import * as xml from "xml-js";
import * as XLSX from "xlsx";

export async function convertText(
  input: Buffer,
  from: string,
  to: string
): Promise<Buffer> {
  const text = input.toString("utf-8");

  // CSV → JSON
  if (from === "csv" && to === "json") {
    const records = parseCSV(text, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
    return Buffer.from(JSON.stringify(records, null, 2));
  }

  // CSV → XLSX
  if (from === "csv" && to === "xlsx") {
    const workbook = XLSX.read(input, { type: "buffer" });
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  }

  // JSON → CSV
  if (from === "json" && to === "csv") {
    const data = JSON.parse(text);
    const csv = stringifyCSV(data, { header: true });
    return Buffer.from(csv);
  }

  // JSON → TOML
  if (from === "json" && to === "toml") {
    const obj = JSON.parse(text);
    return Buffer.from(toml.stringify(obj));
  }

  // TOML → JSON
  if (from === "toml" && to === "json") {
    const obj = toml.parse(text);
    return Buffer.from(JSON.stringify(obj, null, 2));
  }

  // YAML → JSON
  if (from === "yaml" && to === "json") {
    const obj = yaml.load(text);
    return Buffer.from(JSON.stringify(obj, null, 2));
  }

  // JSON → YAML
  if (from === "json" && to === "yaml") {
    const obj = JSON.parse(text);
    return Buffer.from(yaml.dump(obj));
  }

  // INI → JSON
  if (from === "ini" && to === "json") {
    const obj = ini.parse(text);
    return Buffer.from(JSON.stringify(obj, null, 2));
  }

  // JSON → INI
  if (from === "json" && to === "ini") {
    const obj = JSON.parse(text);
    return Buffer.from(ini.stringify(obj));
  }

  // XML → JSON
  if (from === "xml" && to === "json") {
    const json = xml.xml2json(text, { compact: true, spaces: 2 });
    return Buffer.from(json);
  }

  // JSON → XML
  if (from === "json" && to === "xml") {
    const obj = JSON.parse(text);
    const xmlStr = xml.json2xml(obj, {
      compact: true,
      spaces: 2,
      fullTagEmptyElement: true,
    });
    return Buffer.from(xmlStr);
  }

  // NDJSON → JSON
  if (from === "ndjson" && to === "json") {
    const lines = text.trim().split("\n");
    const records = lines.map((line) => JSON.parse(line));
    return Buffer.from(JSON.stringify(records, null, 2));
  }

  // JSON → NDJSON
  if (from === "json" && to === "ndjson") {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new Error("JSON input must be an array to convert to NDJSON");
    }
    const ndjson = data
      .map((record: unknown) => JSON.stringify(record))
      .join("\n");
    return Buffer.from(ndjson);
  }

  throw new Error(`Unsupported text conversion: ${from} → ${to}`);
}
