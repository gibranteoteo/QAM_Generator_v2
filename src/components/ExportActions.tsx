"use client";

import { useState } from "react";
import { WeatherReportData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileImage, FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";

interface ExportActionsProps {
  data: WeatherReportData;
  printRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportActions({ data, printRef }: ExportActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCopyJPG = async () => {
    if (!printRef.current) return;
    setLoading("jpg");
    try {
      // Use html-to-image (faster, native browser SVG rendering, fixes Tailwind v4 oklch crash)
      const dataUrl = await toPng(printRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const blob = await (await fetch(dataUrl)).blob();

      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        toast.success("Laporan berhasil disalin ke clipboard!");
      } catch (err) {
        console.error("Clipboard API err:", err);
        // Fallback constraint if Clipboard API is restricted by browser config (HTTP / permissions)
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `QAM_${data.reportType.replace(" ", "_")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info("Browser memblokir copy direct. File telah otomatis diunduh sebagai gambar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat memproses gambar.");
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setLoading("pdf");
    try {
      const dataUrl = await toJpeg(printRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297);
      pdf.save(`QAM_${data.reportType.replace(" ", "_")}_${new Date().getTime()}.pdf`);
      toast.success("PDF berhasil diunduh!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh PDF.");
    } finally {
      setLoading(null);
    }
  };

  const handleExportCSV = () => {
    setLoading("csv");
    try {
      const headers = ["ReportType", "Time", "WindDir", "WindSpeed", "VisibilityValue", "VisibilityUnit", "PresentWX", "Temp", "DewPoint", "QNH", "QFF", "Clouds", "SuppInfo", "Trend", "Observer", "Remarks"];
      
      const presentWeatherStr = [
        data.presentWeather.intensity,
        data.presentWeather.descriptor,
        data.presentWeather.precipitation,
        data.presentWeather.obscuration
      ].filter(Boolean).join(" ");
      
      const cloudsStr = `${data.cloudAmount} ${data.cloudHeight} ${data.cloudType}`.trim();

      const suppStr = [
        data.supplementaryInfo?.sigWeather,
        data.supplementaryInfo?.runway,
        data.supplementaryInfo?.cbInfo,
        data.supplementaryInfo?.cbPosition,
        data.supplementaryInfo?.cbDirection
      ].filter(Boolean).join(" ").trim();

      const trendStr = [
        data.trendForecast?.trend1,
        data.trendForecast?.trend2,
        data.trendForecast?.trend3,
      ].filter(Boolean).join(" ").trim();

      const row = [
        data.reportType,
        data.reportTime,
        data.windDirection,
        data.windSpeed,
        data.visibilityValue,
        data.visibilityUnit,
        presentWeatherStr,
        data.temperature,
        data.dewPoint,
        data.pressureQnh,
        data.pressureQff,
        cloudsStr,
        suppStr,
        trendStr,
        data.observerName,
        data.remarks
      ].map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(",");

      const csvContent = headers.join(",") + "\n" + row;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `QAM_Data_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV berhasil diekspor!");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengekspor CSV.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button variant="outline" size="sm" onClick={handleCopyJPG} disabled={!!loading} className="gap-2 h-8">
        {loading === "jpg" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
        <span className="hidden lg:inline text-xs">Copy JPG</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={!!loading} className="gap-2 h-8">
        {loading === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        <span className="hidden lg:inline text-xs">Download PDF</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={!!loading} className="gap-2 h-8">
        {loading === "csv" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        <span className="hidden lg:inline text-xs">Export CSV</span>
      </Button>
    </div>
  );
}
