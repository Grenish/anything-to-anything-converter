import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  FileText,
  ImageIcon,
  Database,
  Shield,
  Zap,
} from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-svh w-full bg-secondary/30 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-background border-b border-border py-12 mt-10 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl font-serif font-medium mb-4">Documentation</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Everything you need to know about A2A Converter's capabilities,
          architecture, and supported formats.
        </p>
      </div>

      <div className="w-full max-w-5xl p-6 py-12 space-y-12">
        {/* Getting Started */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Getting Started
            </h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>How to use A2A Converter</CardTitle>
              <CardDescription>
                Simple 3-step process to transform your files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <span className="text-4xl font-bold text-muted-foreground/20">
                    01
                  </span>
                  <h3 className="font-medium text-foreground">Upload File</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file or click to select. We automatically
                    detect the file type.
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-4xl font-bold text-muted-foreground/20">
                    02
                  </span>
                  <h3 className="font-medium text-foreground">Select Output</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your desired target format from the available
                    conversion options.
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-4xl font-bold text-muted-foreground/20">
                    03
                  </span>
                  <h3 className="font-medium text-foreground">
                    Convert & Download
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Click convert. Your file is processed securely and ready for
                    download instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              How It Works
            </h2>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="leading-relaxed">
                  A2A Converter operates on a sophisticated, server-side engine
                  designed for speed and fidelity. When you upload a file, it is
                  streamed to our secure processing layer which routes the
                  request to a specialized engine based on the file type:
                </p>
                <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0 mt-6">
                  <li className="bg-secondary/50 p-4 rounded-lg">
                    <strong className="mb-1 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Document Engine
                    </strong>
                    Utilizes headless browser technology (Puppeteer) for
                    high-fidelity PDF rendering and AST-based parsers for
                    Markdown/HTML transformations.
                  </li>
                  <li className="bg-secondary/50 p-4 rounded-lg">
                    <strong className="mb-1 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" /> Image Engine
                    </strong>
                    Powered by low-level image processing libraries (Sharp) to
                    perform pixel-perfect format conversions and optimizations.
                  </li>
                  <li className="bg-secondary/50 p-4 rounded-lg">
                    <strong className="mb-1 flex items-center gap-2">
                      <Database className="w-4 h-4" /> Data Engine
                    </strong>
                    Strict schema validation and transformation streams ensure
                    CSV, JSON, and XML data is converted accurately without data
                    loss.
                  </li>
                  <li className="bg-secondary/50 p-4 rounded-lg">
                    <strong className="mb-1 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Privacy First
                    </strong>
                    All processing happens in-memory. Files are never written to
                    disk and are strictly discarded immediately after the
                    response is sent.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Supported Formats */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Supported Formats
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Matrix</CardTitle>
              <CardDescription>
                A comprehensive list of all supported input and output
                combinations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Category</TableHead>
                    <TableHead className="w-[150px]">Input Format</TableHead>
                    <TableHead>Available Output Formats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Documents</TableCell>
                    <TableCell>
                      <Badge variant="outline">PDF</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      HTML, Markdown, Text
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Documents</TableCell>
                    <TableCell>
                      <Badge variant="outline">Markdown</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      HTML, PDF
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Documents</TableCell>
                    <TableCell>
                      <Badge variant="outline">HTML</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      Markdown, PDF
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Structured Data
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">CSV</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      JSON, XLSX
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Structured Data
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">JSON</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      CSV, TOML, YAML, INI, XML, NDJSON
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Structured Data
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">YAML / XML / INI</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      JSON
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Images</TableCell>
                    <TableCell>
                      <Badge variant="outline">PNG / JPG / WEBP</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      PNG, JPG, WEBP (Interchangeable)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
