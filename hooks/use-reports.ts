import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { reportsApi, StudentReportDownloadParams } from "@/lib/api/reports";

type DownloadStudentReportOptions = StudentReportDownloadParams & {
  termLabel?: string;
};

const normalizeSegment = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "report";

const extractFilenameFromDisposition = (contentDisposition?: string) => {
  if (!contentDisposition) return null;

  const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  if (!filenameMatch?.[1]) return null;

  try {
    return decodeURIComponent(filenameMatch[1].replace(/"/g, "").trim());
  } catch (error) {
    return filenameMatch[1];
  }
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const responseMessage =
      error.response?.data instanceof Blob
        ? fallback
        : error.response?.data?.message || error.response?.data?.error;
    return responseMessage || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

export const useReports = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadStudentReport = useCallback(
    async ({ studentId, academicYear, term, termLabel }: DownloadStudentReportOptions) => {
      if (!studentId || !academicYear) {
        toast.error("Sélectionnez un étudiant et une année académique.");
        return;
      }

      setIsDownloading(true);

      try {
        const response = await reportsApi.downloadStudentReport({
          studentId,
          academicYear,
          term,
        });

        const blob = response.data;
        if (!(blob instanceof Blob)) {
          throw new Error("La réponse téléchargée est vide ou invalide.");
        }

        const inferredFileName =
          extractFilenameFromDisposition(response.headers?.["content-disposition"]) ||
          `student-${normalizeSegment(studentId)}-${normalizeSegment(
            termLabel && term ? termLabel : "annee"
          )}-${normalizeSegment(academicYear)}.pdf`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = inferredFileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Le bulletin a été téléchargé avec succès.");
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Impossible de télécharger le bulletin. Veuillez réessayer."
        );
        toast.error(message);
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  return {
    downloadStudentReport,
    isDownloading,
  };
};
