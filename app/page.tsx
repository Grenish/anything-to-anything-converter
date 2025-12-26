"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileType,
  ArrowRight,
  Command,
  Loader2,
  CheckCircle,
  AlertCircle,
  History,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conversionRules } from "@/util/conversion-rule";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [inputFormat, setInputFormat] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "converting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    let extension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    if (extension === "jpeg") extension = "jpg";
    if (extension === "md") extension = "markdown";

    // Check if extension is supported in our rules
    if (extension && extension in conversionRules) {
      setInputFormat(extension);
      setOutputFormat(""); // Reset output format
      setStatus("idle");
      setErrorMessage("");
    } else {
      setInputFormat(extension || "unknown");
      setErrorMessage("Unsupported file format detected.");
      setStatus("error");
    }
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    setIsConverting(true);
    setStatus("converting");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("to", outputFormat);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Try to get filename from header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "converted-file." + outputFormat;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      // Save to history
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const historyItem = {
        input: inputFormat.toUpperCase(),
        output: outputFormat.toUpperCase(),
        time: timeString,
        fileName: filename,
        downloadLink: url,
        timestamp: now.getTime(),
      };

      try {
        const history = JSON.parse(
          sessionStorage.getItem("conversionHistory") || "[]"
        );
        sessionStorage.setItem(
          "conversionHistory",
          JSON.stringify([historyItem, ...history])
        );
      } catch (e) {
        console.error("Failed to save history", e);
      }

      // Note: We are NOT revoking the URL immediately to allow history download in this session.
      // ideally we would manage these ObjectURLs and revoke them on cleanup.

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsConverting(false);
    }
  };

  // Filter available output formats based on input format
  const availableOutputFormats =
    inputFormat && inputFormat in conversionRules
      ? conversionRules[inputFormat as keyof typeof conversionRules]
      : [];

  return (
    <div className="min-h-svh w-full bg-secondary/30 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl">
          <Card className="border-2 border-primary bg-card shadow-[8px_8px_0px_0px_hsl(var(--primary))] pt-0 pb-0">
            <CardHeader className="bg-primary text-primary-foreground p-2 flex flex-row items-center justify-between space-y-0 rounded-none border-b-2 border-primary">
              <span className="text-xs uppercase tracking-widest pl-2">
                Universal_Converter.exe
              </span>
              <div className="flex gap-1.5 pr-1">
                <div className="w-3 h-3 border border-primary-foreground bg-transparent" />
                <div className="w-3 h-3 border border-primary-foreground bg-primary-foreground" />
              </div>
            </CardHeader>

            {/* Window Body */}
            <CardContent className="text-center pt-6">
              <Badge
                variant="outline"
                className="rounded-none border-primary text-foreground mb-6 bg-secondary/50 font-normal px-3 py-1 text-xs uppercase tracking-wider"
              >
                v1.0.4 &bull; Stable
              </Badge>

              <h2 className="text-4xl sm:text-5xl font-serif font-medium mb-4 leading-tight tracking-tight text-foreground">
                Anything to Anything.
              </h2>

              <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
                The web&apos;s most reliable utility. Convert CSV to PDF,
                Markdown to HTML, or Images to WebP. No ads, no fluff.
              </p>

              {/* Upload Zone */}
              <div
                className="group relative cursor-pointer mb-8"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <div
                  className={`h-48 w-full border-2 border-dashed ${file ? "border-primary bg-muted/30" : "border-muted-foreground/30 bg-muted/10"} flex flex-col items-center justify-center transition-all hover:border-primary hover:bg-muted/30 rounded-none`}
                >
                  <div className="bg-muted p-3 rounded-none border border-border mb-4 group-hover:bg-background group-hover:border-primary transition-colors">
                    <Upload
                      className="w-6 h-6 text-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-sm text-foreground">
                    {file ? (
                      <span className="font-bold">{file.name}</span>
                    ) : (
                      <>
                        <span className="font-bold underline decoration-1 underline-offset-2">
                          Click to select
                        </span>{" "}
                        or drag file here
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : "MAX: 50MB"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Input Select (Read-only/Inferred) */}
                  <Select value={inputFormat} disabled>
                    <SelectTrigger className="w-full sm:w-35 border-2 border-primary shadow-none h-11 bg-background text-foreground opacity-100">
                      <SelectValue placeholder="Input" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-primary bg-popover text-popover-foreground">
                      {inputFormat && (
                        <SelectItem value={inputFormat}>
                          {inputFormat}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />

                  {/* Output Select */}
                  <Select
                    value={outputFormat}
                    onValueChange={setOutputFormat}
                    disabled={
                      !inputFormat || availableOutputFormats.length === 0
                    }
                  >
                    <SelectTrigger className="w-full sm:w-35 border-2 border-primary shadow-none h-11 bg-background text-foreground">
                      <SelectValue placeholder="Target" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-primary bg-popover text-popover-foreground">
                      {availableOutputFormats.map((fmt: string) => (
                        <SelectItem
                          key={fmt}
                          value={fmt}
                          className="cursor-pointer"
                        >
                          {fmt}
                        </SelectItem>
                      ))}
                      {availableOutputFormats.length === 0 && (
                        <div className="p-2 text-xs text-muted-foreground">
                          No conversions available
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleConvert}
                  disabled={
                    !file || !outputFormat || isConverting || status === "error"
                  }
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  {isConverting ? (
                    <>
                      <Spinner />
                      Converting...
                    </>
                  ) : (
                    "Convert Now"
                  )}
                </Button>
                <Link
                  href="/history"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full sm:w-auto min-w-[140px]"
                  )}
                >
                  <History /> History
                </Link>
              </div>
            </CardContent>

            {/* Window Footer / Status Bar */}
            <CardFooter
              className={`p-2 py-3 flex items-center justify-between border-t-2 border-primary ${status === "error" ? "bg-destructive/10 text-destructive" : status === "success" ? "bg-green-500/10 text-green-700" : "bg-muted/50"}`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                STATUS: {status.toUpperCase()}
              </span>
              <span className="flex items-center gap-2 text-sm">
                {status === "error" && errorMessage ? (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errorMessage}
                  </span>
                ) : status === "success" ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Download Started
                  </span>
                ) : (
                  "READY"
                )}
              </span>
            </CardFooter>
          </Card>

          {/* Supported Formats Ticker */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground uppercase tracking-tight font-medium">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> PDF
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> CSV
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> JSON
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> WEBP
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> MD
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> HTML
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-default">
              <FileType className="w-3 h-3" /> TXT
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
