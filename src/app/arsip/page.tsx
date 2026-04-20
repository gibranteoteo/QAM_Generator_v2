"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getWeatherReports } from "@/actions/reports";
import { CloudRain, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function ArsipPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/login");
    } else {
      fetchReports();
    }
  }, [session, isPending, router]);

  const fetchReports = async () => {
    setLoading(true);
    const result = await getWeatherReports();
    if (result.success) {
      setReports(result.data);
    }
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (reports.length === 0) return;

    // Build CSV Headers
    const headers = [
      "ID",
      "Type",
      "Time (UTC)",
      "Wind Dir",
      "Wind Speed",
      "Visibility",
      "Temp",
      "Dew Point",
      "QNH",
      "QFF",
      "Observer",
      "Saved At"
    ];

    // Build Rows
    const rows = reports.map((r) => [
      r.id,
      r.reportType,
      r.reportTime,
      r.windDirection,
      r.windSpeed,
      `${r.visibilityValue} ${r.visibilityUnit}`,
      r.temperature,
      r.dewPoint,
      r.pressureQnh,
      r.pressureQff,
      r.observerName,
      r.createdAt ? new Date(r.createdAt).toISOString() : ""
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map(v => `"${v}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Arsip_QAM_${format(new Date(), "yyyyMMdd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted/30">
      <header className="h-14 border-b bg-background flex items-center justify-between px-4 lg:px-6 shrink-0 relative z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-primary" />
          <h1 className="font-semibold text-lg tracking-tight">Data Arsip QAM</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Form
          </Button>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <div className="text-sm font-medium hidden sm:block">
            {session.user.name}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto bg-background rounded-lg shadow-md border overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center bg-muted/10">
            <div>
              <h2 className="font-bold text-lg">Riwayat Laporan</h2>
              <p className="text-sm text-muted-foreground">Menampilkan semua arsip pelaporan Metar QAM</p>
            </div>
            <Button onClick={handleExportCSV} disabled={reports.length === 0} className="gap-2 bg-green-600 hover:bg-green-700">
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tgl Simpan (WIB)</TableHead>
                  <TableHead>Waktu (UTC)</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Angin</TableHead>
                  <TableHead>Visibilitas</TableHead>
                  <TableHead>Suhu/Dew</TableHead>
                  <TableHead>QNH</TableHead>
                  <TableHead>Pengamat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Memuat data arsip...
                    </TableCell>
                  </TableRow>
                ) : reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Belum ada arsip laporan yang tersimpan.
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.createdAt ? format(new Date(report.createdAt), "dd MMM yyyy HH:mm", { locale: idLocale }) : "-"}
                      </TableCell>
                      <TableCell>{report.reportTime}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell>{report.windDirection}° / {report.windSpeed} KT</TableCell>
                      <TableCell>{report.visibilityValue} {report.visibilityUnit}</TableCell>
                      <TableCell>{report.temperature}°C / {report.dewPoint}°C</TableCell>
                      <TableCell>{report.pressureQnh} hPa</TableCell>
                      <TableCell>{report.observerName}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
