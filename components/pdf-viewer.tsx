"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CircleMinus,
  CirclePlus,
  Loader2,
  RotateCcw,
  RotateCw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const ZOOM_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4, 8];

function highlightPattern(text: string, pattern: string, itemIndex: number) {
  return text.replace(
    pattern,
    (value: string) => `<mark id="search-result-${itemIndex}">${value}</mark>`
  );
}

function Component({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | { url: string } | null>(null);

  const textRenderer = useCallback(
    (textItem: { str: string; itemIndex: number }) =>
      highlightPattern(textItem.str, searchQuery, textItem.itemIndex),
    [searchQuery]
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error);
    setError(error.message || "Failed to load PDF document.");
  }

  // Convert blob URL to proper format for react-pdf
  useEffect(() => {
    if (!url) {
      setPdfFile(null);
      return;
    }

    // If it's a blob URL, pass it with httpHeaders to prevent download
    if (url.startsWith('blob:')) {
      setPdfFile({ url });
    } else {
      setPdfFile(url);
    }
  }, [url]);

  useEffect(() => {
    setError(null);
    setNumPages(null);
    setCurrentPage(1);
  }, [url]);

  useEffect(() => {
    if (!viewportRef.current) return;

    const options = {
      root: viewportRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageElement = entry.target.closest("[data-page-number]");
          if (pageElement) {
            const pageNumber = parseInt(
              pageElement.getAttribute("data-page-number") || "1",
              10
            );
            setCurrentPage(pageNumber);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    const mutationObserver = new MutationObserver(() => {
      const pages = viewportRef.current?.querySelectorAll(".react-pdf__Page");
      if (pages) {
        pages.forEach((page) => {
          observer.observe(page);
        });
      }
    });

    mutationObserver.observe(viewportRef.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [numPages]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center text-destructive">
          <p className="font-semibold mb-2">Error loading PDF</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No PDF loaded</p>
        </div>
      </div>
    );
  }

  return (
    <Document
      file={pdfFile}
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={onDocumentLoadError}
      className="w-full h-full"
      options={{
        cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
      }}
      loading={
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="size-4 animate-spin" />
        </div>
      }
    >
      <div className="w-full h-full flex flex-col">
        <div className="flex p-2 border-b justify-between">
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {numPages}
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setRotation(rotation - 90)}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => setRotation(rotation + 90)}
            >
              <RotateCw className="size-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={zoom <= ZOOM_OPTIONS[0]}
              onClick={() => setZoom(zoom - 0.25)}
            >
              <CircleMinus className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={zoom >= ZOOM_OPTIONS[ZOOM_OPTIONS.length - 1]}
              onClick={() => setZoom(zoom + 0.25)}
            >
              <CirclePlus className="size-4" />
            </Button>

            <Select
              value={zoom.toString()}
              onValueChange={(value) => setZoom(Number(value))}
            >
              <SelectTrigger className="h-7 rounded-sm w-24">
                <SelectValue placeholder="Zoom">{`${zoom * 100}%`}</SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                {ZOOM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {`${option * 100}%`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Separator orientation="vertical" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <Search className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <ScrollArea className="h-16 grow w-full">
          <div className="flex flex-row grow">
            <ScrollArea className="grow w-48" ref={viewportRef}>
              <ScrollBar orientation="horizontal" />
              <div className="items-center flex p-8 flex-col grow w-full">
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    data-page-number={index + 1}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    scale={zoom}
                    rotate={rotation}
                    loading={null}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </ScrollArea>
      </div>
    </Document>
  );
}

export { Component };