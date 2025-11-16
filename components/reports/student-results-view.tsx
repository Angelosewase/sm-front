"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportsApi } from "@/lib/api/reports";
import { Component as PdfViewer } from "@/components/pdf-viewer";
import { toast } from "sonner";
import { useAcademicYears, useTermsByAcademicYear } from "@/hooks/use-academic-terms";

type ReportScope = "year" | "term";

type StudentResultsViewProps = {
  studentId: string;
};

export default function StudentResultsView({ studentId }: StudentResultsViewProps) {
  const { data: academicYears = [], isLoading: isYearsLoading, error: yearsError } = useAcademicYears();
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [reportScope, setReportScope] = useState<ReportScope>("year");
  const { data: terms = [], isLoading: isTermsLoading, error: termsError } = useTermsByAcademicYear(selectedYearId || undefined);
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [pdfData, setPdfData] = useState<{ blob: Blob; fileName: string } | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedYearId && academicYears.length > 0) {
      setSelectedYearId(academicYears[0]._id);
    }
  }, [selectedYearId, academicYears]);

  useEffect(() => {
    if (reportScope === "term" && !selectedTermId && terms.length > 0) {
      setSelectedTermId(terms[0]._id);
    }
  }, [reportScope, selectedTermId, terms]);

  const selectedYearOption = useMemo(
    () => academicYears.find((year) => year._id === selectedYearId) ?? null,
    [selectedYearId, academicYears]
  );

  const selectedTermOption = useMemo(
    () => terms.find((term) => term._id === selectedTermId) ?? null,
    [selectedTermId, terms]
  );

  const filterSummary = useMemo(() => {
    if (!selectedYearOption) {
      return "Please select an academic year to continue.";
    }

    if (reportScope === "year") {
      return `Displaying annual report card for ${selectedYearOption.label}.`;
    }

    const termLabel = selectedTermOption ? `Term ${selectedTermOption.order}` : undefined;

    if (!termLabel) {
      return `Displaying term report card for ${selectedYearOption.label}.`;
    }

    return `Displaying ${termLabel} report card for ${selectedYearOption.label}.`;
  }, [reportScope, selectedTermOption, selectedYearOption]);

  const isTermScope = reportScope === "term";
  const isLoadDisabled =
    !studentId || !selectedYearOption || (isTermScope && !selectedTermOption) || isLoading;

  const normalizeSegment = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();

  const extractFilenameFromDisposition = (contentDisposition?: string) => {
    if (!contentDisposition) return null;
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, "");
    }
    return null;
  };

  const handleLoadReport = async () => {
    if (!studentId || !selectedYearOption) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await reportsApi.downloadStudentReport({
        studentId,
        academicYearId: selectedYearOption._id,
        termId: isTermScope ? selectedTermOption?._id : undefined,
      });

      const blob = response.data;
      if (!(blob instanceof Blob)) {
        throw new Error("Downloaded response is empty or invalid.");
      }

      // Ensure the blob is of type application/pdf
      const pdfBlob = blob.type === "application/pdf" 
        ? blob 
        : new Blob([blob], { type: "application/pdf" });

      const inferredFileName =
        extractFilenameFromDisposition(response.headers?.["content-disposition"]) ||
        `student-${normalizeSegment(studentId)}-${normalizeSegment(
          selectedTermOption && isTermScope ? `term-${selectedTermOption.order}` : "year"
        )}-${normalizeSegment(selectedYearOption.label)}.pdf`;

      // Clean up previous blob URL if it exists
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }

      // Create a blob URL for viewing
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfData({ blob: pdfBlob, fileName: inferredFileName });
      setPdfUrl(url);

      toast.success("Report card loaded successfully.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to load report card. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfData) {
      return;
    }

    // Create a new blob URL specifically for downloading
    const downloadUrl = window.URL.createObjectURL(pdfData.blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = pdfData.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Clean up the download URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);

    toast.success("Report card downloaded successfully.");
  };

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Reset PDF when filters change
  useEffect(() => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setPdfData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYearId, reportScope, selectedTermId]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg ">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Year:</span>
              <Select value={selectedYearId} onValueChange={setSelectedYearId} disabled={isYearsLoading || !!yearsError}>
                <SelectTrigger className="h-8 w-32 text-xs shadow-sm focus-visible:ring-primary-200">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year._id} value={year._id}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Scope:</span>
              <Select value={reportScope} onValueChange={(value: ReportScope) => setReportScope(value)}>
                <SelectTrigger className="h-8 w-28 text-xs shadow-sm focus-visible:ring-primary-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Full Year</SelectItem>
                  <SelectItem value="term">Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isTermScope && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Term:</span>
                <div className="flex ">
                  {terms.map((term: any, idx: number) => {
                    const isFirst = idx === 0;
                    const isLast = idx === terms.length - 1;
                    let roundedClass = "";
                    if (isFirst) roundedClass = "rounded-l-md";
                    else if (isLast) roundedClass = "rounded-r-md";
                    else roundedClass = "rounded-none";

                    return (
                      <Button
                        key={term._id}
                        type="button"
                        variant={selectedTermId === term._id ? "default" : "outline"}
                        size="sm"
                        className={`h-8 px-3 text-xs rounded-none ${roundedClass} -ml-[1px]`}
                        onClick={() => setSelectedTermId(term._id)}
                      >
                        {`Term ${term.order}`}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              type="button"
              className="flex-1 md:flex-initial h-9 text-xs"
              onClick={handleLoadReport}
              disabled={isLoadDisabled || isYearsLoading || (!!yearsError) || (isTermScope && (isTermsLoading || !!termsError))}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-3 w-3" />
                  View Report Card
                </>
              )}
            </Button>
            {pdfUrl && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 md:flex-initial h-9 text-xs"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-600">{filterSummary}</p>
      </section>

      {pdfUrl ? (
        <section className="rounded-lg shadow-sm overflow-hidden sticky top-0 z-10">
          <div className="h-[calc(100vh-100px)] w-full flex flex-col">
            <PdfViewer url={pdfUrl} />
          </div>
        </section>
      ) : (
        <section className="rounded-lg  p-12 shadow-sm">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Select the parameters above and click &quot;View Report Card&quot; to display the report.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}