"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowBigRight, ArrowLeft, File, History } from "lucide-react";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("conversionHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleClearHistory = () => {
    sessionStorage.removeItem("conversionHistory");
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-svh bg-secondary/30">
      <div className="w-full max-w-2xl">
        <Card className="min-h-[60vh] max-h-[60vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <Link
                href="/"
                className="flex items-center gap-1 mb-2 hover:underline"
              >
                <ArrowLeft className="inline" size={15} />
                Go Back
              </Link>
              <CardTitle className="text-xl font-medium">History</CardTitle>
              <CardDescription className="text-sm">
                Every conversion you do will be saved here but only for this
                session. If you close your tab/window, the history will be
                cleared.
              </CardDescription>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearHistory}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </CardHeader>
          <ScrollArea className="md:h-[50vh] h-[45vh] rounded-md">
            <CardContent className="w-full flex flex-col gap-2 my-5">
              {history.length === 0 ? (
                <div className="h-[45vh] w-full flex items-center justify-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia>
                        <History />
                      </EmptyMedia>
                      <EmptyTitle>No conversion history found.</EmptyTitle>
                      <EmptyDescription>
                        You have not made any conversions yet.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </div>
              ) : (
                history.map((item, index) => (
                  <ItemsCard
                    key={index}
                    input={item.input}
                    output={item.output}
                    time={item.time}
                    fileName={item.fileName}
                    icon={<File size={16} />}
                    downloadLink={item.downloadLink}
                  />
                ))
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

interface ItemsCardProps {
  input: string;
  output: string;
  time: string;
  fileName: string;
  icon: React.ReactNode;
  downloadLink: string;
}

const ItemsCard = ({
  input,
  output,
  time,
  fileName,
  icon,
  downloadLink,
}: ItemsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-1">
          {input} <ArrowBigRight className="inline" size={15} /> {output}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <History className="inline" size={15} /> {time}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm font-medium break-all">
            {icon} {fileName.slice(0, 5) + "..."}
            {/* {output.toLocaleLowerCase()} */}
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 text-sm font-medium break-all">
            {output.toLocaleLowerCase()}
          </div>
        </div>
        <a
          href={downloadLink}
          download={fileName}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full sm:w-auto",
          )}
        >
          Download {output}
        </a>
      </CardContent>
    </Card>
  );
};
