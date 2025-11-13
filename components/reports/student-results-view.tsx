import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReports } from "@/hooks/use-reports";
import { PrimarySchoolReport } from "./primary-school-report";

type ReportScope = "year" | "term";

type AcademicYearOption = {
  label: string;
  value: string;
};

type TermOption = {
  label: string;
  value: string;
};

const academicYears: AcademicYearOption[] = [
  { label: "2025/2026", value: "2025/2026" },
  { label: "2024/2025", value: "2024/2025" },
  { label: "2023/2024", value: "2023/2024" },
];

const terms: TermOption[] = [
  { label: "Premier trimestre", value: "Term 1" },
  { label: "Deuxième trimestre", value: "Term 2" },
  { label: "Troisième trimestre", value: "Term 3" },
];

type StudentResultsViewProps = {
  studentId: string;
};

export default function StudentResultsView({ studentId }: StudentResultsViewProps) {
  const [selectedYear, setSelectedYear] = useState<string>(academicYears[0]?.value ?? "");
  const [reportScope, setReportScope] = useState<ReportScope>("year");
  const [selectedTerm, setSelectedTerm] = useState<string>(terms[0]?.value ?? "");

  const { downloadStudentReport, isDownloading } = useReports();

  useEffect(() => {
    if (reportScope === "term" && !selectedTerm && terms.length > 0) {
      setSelectedTerm(terms[0].value);
    }
  }, [reportScope, selectedTerm]);

  const selectedYearOption = useMemo(
    () => academicYears.find((year) => year.value === selectedYear) ?? null,
    [selectedYear]
  );

  const selectedTermOption = useMemo(
    () => terms.find((term) => term.value === selectedTerm) ?? null,
    [selectedTerm]
  );

  const filterSummary = useMemo(() => {
    if (!selectedYearOption) {
      return "Sélectionnez une année académique pour continuer.";
    }

    if (reportScope === "year") {
      return `Affichage du bulletin annuel pour ${selectedYearOption.label}.`;
    }

    const termLabel = selectedTermOption?.label;

    if (!termLabel) {
      return `Affichage du bulletin trimestriel pour ${selectedYearOption.label}.`;
    }

    return `Affichage du bulletin du ${termLabel.toLowerCase()} pour ${selectedYearOption.label}.`;
  }, [reportScope, selectedTermOption, selectedYearOption]);

  const isTermScope = reportScope === "term";
  const isDownloadDisabled =
    !studentId || !selectedYearOption || (isTermScope && !selectedTermOption) || isDownloading;

  const handleDownload = () => {
    if (!studentId || !selectedYearOption) {
      return;
    }

    downloadStudentReport({
      studentId,
      academicYear: selectedYearOption.value,
      term: isTermScope ? selectedTermOption?.value : undefined,
      termLabel: selectedTermOption?.label,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid w-full gap-5 md:grid-cols-3 md:gap-6">
            <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              <span>Année académique</span>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full justify-between bg-white text-gray-900 shadow-sm focus-visible:ring-primary-200">
                  <SelectValue placeholder="Sélectionnez une année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              <span>Portée du rapport</span>
              <Select value={reportScope} onValueChange={(value: ReportScope) => setReportScope(value)}>
                <SelectTrigger className="w-full justify-between bg-white text-gray-900 shadow-sm focus-visible:ring-primary-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Rapport de l&apos;année entière</SelectItem>
                  <SelectItem value="term">Rapport d&apos;un trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 text-sm font-medium text-gray-700">
              <span>Trimestre</span>
              <Select
                value={selectedTerm}
                onValueChange={setSelectedTerm}
                disabled={!isTermScope}
              >
                <SelectTrigger
                  className="w-full justify-between bg-white text-gray-900 shadow-sm focus-visible:ring-primary-200"
                  disabled={!isTermScope}
                >
                  <SelectValue placeholder="Sélectionnez un trimestre" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            className="w-full md:w-auto"
            onClick={handleDownload}
            disabled={isDownloadDisabled}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Téléchargement...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Télécharger le bulletin
              </>
            )}
          </Button>
        </div>

        <p className="mt-6 text-sm text-gray-600">{filterSummary}</p>
      </section>

      <PrimarySchoolReport />
    </div>
  );
}
