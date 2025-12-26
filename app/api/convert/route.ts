import { NextRequest, NextResponse } from "next/server";
import { convertText } from "@/engines/convert-text";
import { convertImage } from "@/engines/convert-image";
import { convertDocument } from "@/engines/convert-document";
import { conversionRules } from "@/util/conversion-rule";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const to = formData.get("to") as string | null;

    if (!file || !to) {
      return NextResponse.json(
        { error: "File and target format are required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    let from = originalName.split(".").pop()?.toLowerCase();

    if (from === "md") from = "markdown";

    if (!from) {
      return NextResponse.json(
        { error: "Could not determine input format" },
        { status: 400 }
      );
    }

    // Validate against conversion rules if the rule exists for the input format
    const rules = conversionRules as Record<string, readonly string[]>;
    if (rules[from] && !rules[from].includes(to)) {
      return NextResponse.json(
        { error: `Conversion from ${from} to ${to} is not allowed.` },
        { status: 400 }
      );
    }

    let convertedBuffer: Buffer;

    // Dispatch to appropriate engine
    const textFormats = ["csv", "json", "toml", "yaml", "ini", "xml", "ndjson"];
    const imageFormats = ["png", "jpg", "jpeg", "webp"];

    if (textFormats.includes(from)) {
      try {
        convertedBuffer = await convertText(buffer, from, to);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Conversion failed";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else if (imageFormats.includes(from)) {
      try {
        convertedBuffer = await convertImage(buffer, from, to);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Conversion failed";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else if (["markdown", "html", "pdf"].includes(from)) {
      try {
        convertedBuffer = await convertDocument(buffer, from, to);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Conversion failed";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: `Unsupported input format: ${from}` },
        { status: 400 }
      );
    }

    // Determine content type
    let contentType = "application/octet-stream";
    if (["json"].includes(to)) contentType = "application/json";
    if (["csv"].includes(to)) contentType = "text/csv";
    if (["png"].includes(to)) contentType = "image/png";
    if (["jpg", "jpeg"].includes(to)) contentType = "image/jpeg";
    if (["webp"].includes(to)) contentType = "image/webp";
    if (["pdf"].includes(to)) contentType = "application/pdf";
    if (["toml"].includes(to)) contentType = "application/toml";
    if (["yaml"].includes(to)) contentType = "application/x-yaml";
    if (["ini"].includes(to)) contentType = "text/plain";
    if (["xml"].includes(to)) contentType = "application/xml";
    if (["ndjson"].includes(to)) contentType = "application/x-ndjson";
    if (["xlsx"].includes(to))
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const filename = originalName.replace(/\.[^/.]+$/, "") + "." + to;

    return new NextResponse(convertedBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
