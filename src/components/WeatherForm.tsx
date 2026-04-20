"use client";

import { WeatherReportData, PresentWeather } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { saveWeatherReport } from "@/actions/reports";
import { useState } from "react";

interface WeatherFormProps {
  data: WeatherReportData;
  onChange: (data: WeatherReportData | ((prev: WeatherReportData) => WeatherReportData)) => void;
}

export default function WeatherForm({ data, onChange }: WeatherFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof WeatherReportData, value: string | null) => {
    onChange((prev) => ({ ...prev, [field]: value || "" }));
  };

  const handlePresentWeather = (field: keyof PresentWeather, value: string) => {
    onChange((prev) => ({
      ...prev,
      presentWeather: { ...prev.presentWeather, [field]: value === "none" ? "" : value }
    }));
  };

  const handleSupplementaryInfo = (field: keyof typeof data.supplementaryInfo, value: string) => {
    onChange((prev) => ({
      ...prev,
      supplementaryInfo: { ...prev.supplementaryInfo, [field]: value === "none" ? "" : value }
    }));
  };

  const handleTrendForecast = (field: keyof typeof data.trendForecast, value: string) => {
    onChange((prev) => ({
      ...prev,
      trendForecast: { ...prev.trendForecast, [field]: value === "none" ? "" : value }
    }));
  };

  const calculateInches = (hpa: string) => {
    if (!hpa) return "";
    const num = parseFloat(hpa);
    if (isNaN(num)) return "";
    return (num * 0.02953).toFixed(2);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveWeatherReport(data);
      if (result.success) {
        toast.success("Laporan berhasil disimpan ke database!");
      } else {
        toast.error("Gagal menyimpan: " + result.error);
      }
    } catch (e) {
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate arrays for dropdowns
  const windDirs = Array.from({ length: 36 }, (_, i) => (i * 10).toString().padStart(3, '0'));
  const windSpeeds = Array.from({ length: 38 }, (_, i) => i.toString()); // 0-37
  const cloudHeights = ["NSD", ...Array.from({ length: 13 }, (_, i) => (800 + (i * 100)).toString())];
  const cloudTypes = [
    { value: "CB", label: "CB (Cumulonimbus)" },
    { value: "TCU", label: "TCU (Towering Cumulus)" },
    { value: "VER VIS", label: "VER VIS (Vertical Visibility)" }
  ];
  const temps = Array.from({ length: 20 }, (_, i) => (18 + i).toString()); // 18-37

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black overflow-hidden relative">
      <div className="py-2 px-3 border-b flex justify-between items-center bg-muted/20 shrink-0">
        <h2 className="font-bold text-lg">Parameter Cuaca</h2>
        <Button onClick={handleSave} disabled={isSaving} size="default" className="h-9 gap-2 font-semibold">
          <Save className="w-5 h-5" />
          {isSaving ? "Menyimpan..." : "Simpan Data"}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 lg:p-4 space-y-3 pb-8 block text-base">
          
          {/* Laporan Info */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Identifikasi Laporan</h3>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Jenis</Label>
                <Select value={data.reportType} onValueChange={(v) => handleChange("reportType", v)}>
                  <SelectTrigger className="h-10 text-base font-medium">
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MET REPORT" className="text-base">MET REPORT</SelectItem>
                    <SelectItem value="SPECIAL" className="text-base">SPECIAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Waktu (UTC)</Label>
                <Input 
                  type="datetime-local" 
                  className="h-10 text-base font-medium"
                  value={data.reportTime} 
                  onChange={(e) => handleChange("reportTime", e.target.value)} 
                />
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Surface Wind */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Angin Permukaan</h3>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Arah (°)</Label>
                <Select value={data.windDirection} onValueChange={(v) => handleChange("windDirection", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium">
                    <SelectValue placeholder="Pilih Arah" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VRB" className="text-base">VRB (Variable)</SelectItem>
                    {windDirs.map(d => (
                      <SelectItem key={d} value={d} className="text-base">{d}°</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Kecepatan (KT)</Label>
                <Select value={data.windSpeed} onValueChange={(v) => handleChange("windSpeed", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium">
                    <SelectValue placeholder="Pilih Kecepatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {windSpeeds.map(s => (
                      <SelectItem key={s} value={s} className="text-base">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Vis & WX - Implicit Section Header Added for alignment */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Visibilitas & Cuaca</h3>
            </div>
            <div className="flex-1 space-y-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Jarak Pandang (Visibility)</Label>
                <div className="flex gap-2">
                  <Input 
                    className="flex-1 h-10 text-base font-medium"
                    placeholder="Masukkan nilai" 
                    value={data.visibilityValue} 
                    onChange={(e) => handleChange("visibilityValue", e.target.value)} 
                  />
                  <Select value={data.visibilityUnit} onValueChange={(v) => handleChange("visibilityUnit", v)}>
                    <SelectTrigger className="w-24 h-10 text-base font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m" className="text-base">m</SelectItem>
                      <SelectItem value="km" className="text-base">km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Cuaca Saat Ini</Label>
                <div className="grid grid-cols-4 gap-1">
                  <Select value={data.presentWeather.intensity || "none"} onValueChange={(v) => handlePresentWeather("intensity", v || "")}>
                    <SelectTrigger className="h-10 text-xs sm:text-base px-1 font-medium"><SelectValue placeholder="Int" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">NIL</SelectItem>
                      <SelectItem value="FBL" className="text-base">FBL (Light)</SelectItem>
                      <SelectItem value="MOD" className="text-base">MOD (Moderate)</SelectItem>
                      <SelectItem value="HVY" className="text-base">HVY (Heavy)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={data.presentWeather.descriptor || "none"} onValueChange={(v) => handlePresentWeather("descriptor", v || "")}>
                    <SelectTrigger className="h-10 text-xs sm:text-base px-1 font-medium"><SelectValue placeholder="Char" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">NIL</SelectItem>
                      <SelectItem value="BL" className="text-base">BL (Blowing)</SelectItem>
                      <SelectItem value="SH" className="text-base">SH (Showers)</SelectItem>
                      <SelectItem value="TS" className="text-base">TS (Thunderstorm)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={data.presentWeather.precipitation || "none"} onValueChange={(v) => handlePresentWeather("precipitation", v || "")}>
                    <SelectTrigger className="h-10 text-xs sm:text-base px-1 font-medium"><SelectValue placeholder="Prcp" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">NIL</SelectItem>
                      <SelectItem value="DZ" className="text-base">DZ (Drizzle)</SelectItem>
                      <SelectItem value="RA" className="text-base">RA (Rain)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={data.presentWeather.obscuration || "none"} onValueChange={(v) => handlePresentWeather("obscuration", v || "")}>
                    <SelectTrigger className="h-10 text-xs sm:text-base px-1 font-medium"><SelectValue placeholder="Obsc" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">NIL</SelectItem>
                      <SelectItem value="BR" className="text-base">BR (Mist)</SelectItem>
                      <SelectItem value="FG" className="text-base">FG (Fog)</SelectItem>
                      <SelectItem value="FU" className="text-base">FU (Smoke)</SelectItem>
                      <SelectItem value="VA" className="text-base">VA (Volcanic Ash)</SelectItem>
                      <SelectItem value="DU" className="text-base">DU (Dust)</SelectItem>
                      <SelectItem value="SA" className="text-base">SA (Sand)</SelectItem>
                      <SelectItem value="HZ" className="text-base">HZ (Haze)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Clouds */}
          <section className="flex gap-3">
             <div className="w-24 lg:w-28 shrink-0 pt-1">
               <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Perawanan</h3>
             </div>
             <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Jumlah</Label>
                  <Select value={data.cloudAmount || "none"} onValueChange={(v) => handleChange("cloudAmount", (v || "") === "none" ? "" : (v || ""))}>
                    <SelectTrigger className="h-10 text-base font-medium">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                      <SelectItem value="FEW" className="text-base">FEW (Few)</SelectItem>
                      <SelectItem value="SCT" className="text-base">SCT (Scattered)</SelectItem>
                      <SelectItem value="BKN" className="text-base">BKN (Broken)</SelectItem>
                      <SelectItem value="OVC" className="text-base">OVC (Overcast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Jenis</Label>
                  <Select value={data.cloudType || "none"} onValueChange={(v) => handleChange("cloudType", (v || "") === "none" ? "" : (v || ""))}>
                    <SelectTrigger className="h-10 text-base font-medium">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                      {cloudTypes.map(c => (
                         <SelectItem key={c.value} value={c.value} className="text-base">{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Tinggi (ft)</Label>
                  <Select value={data.cloudHeight} onValueChange={(v) => handleChange("cloudHeight", v || "")}>
                    <SelectTrigger className="h-10 text-base font-medium">
                      <SelectValue placeholder="Pilih..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudHeights.map(ch => (
                        <SelectItem key={ch} value={ch} className="text-base">{ch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
             </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Temp */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Suhu (°C)</h3>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Air Temp</Label>
                <Select value={data.temperature} onValueChange={(v) => handleChange("temperature", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Suhu" /></SelectTrigger>
                  <SelectContent>
                    {temps.map(t => <SelectItem key={t} value={t} className="text-base">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Dew Point</Label>
                <Select value={data.dewPoint} onValueChange={(v) => handleChange("dewPoint", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Titik Embun" /></SelectTrigger>
                  <SelectContent>
                    {temps.map(t => <SelectItem key={t} value={t} className="text-base">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Pressure */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Tekanan Udara</h3>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold flex justify-between">QNH <span className="text-sm">{calculateInches(data.pressureQnh) ? calculateInches(data.pressureQnh) + " in" : ""}</span></Label>
                <Input 
                  type="number" 
                  step="0.1"
                  className="h-10 text-lg font-bold"
                  placeholder="1012" 
                  value={data.pressureQnh} 
                  onChange={(e) => handleChange("pressureQnh", e.target.value)} 
                />
              </div>
              <div className="space-y-0.5">
                <Label className="text-base font-semibold flex justify-between">QFF <span className="text-sm">{calculateInches(data.pressureQff) ? calculateInches(data.pressureQff) + " in" : ""}</span></Label>
                <Input 
                  type="number" 
                  step="0.1"
                  className="h-10 text-lg font-bold"
                  placeholder="1010.5" 
                  value={data.pressureQff} 
                  onChange={(e) => handleChange("pressureQff", e.target.value)} 
                />
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Supplementary Information */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Informasi Tambahan</h3>
            </div>
            <div className="flex-1 grid grid-cols-5 gap-2">
              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Info CB</Label>
                <Select value={data.supplementaryInfo?.cbInfo || "none"} onValueChange={(v) => handleSupplementaryInfo("cbInfo", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="CB" className="text-base">CB (Cumulonimbus)</SelectItem>
                    <SelectItem value="TS" className="text-base">TS (Thunderstorm)</SelectItem>
                    <SelectItem value="MOD TURB" className="text-base">MOD TURB (Moderate Turbulence)</SelectItem>
                    <SelectItem value="SEV TURB" className="text-base">SEV TURB (Severe Turbulence)</SelectItem>
                    <SelectItem value="WS GR" className="text-base">WS GR (Wind Shear With Hail)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Posisi/Gerakan</Label>
                <Select value={data.supplementaryInfo?.cbPosition || "none"} onValueChange={(v) => handleSupplementaryInfo("cbPosition", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="IN" className="text-base">IN (In)</SelectItem>
                    <SelectItem value="OVER" className="text-base">OVER (Over)</SelectItem>
                    <SelectItem value="TO" className="text-base">TO (To)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Arah Gerakan</Label>
                <Select value={data.supplementaryInfo?.cbDirection || "none"} onValueChange={(v) => handleSupplementaryInfo("cbDirection", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="APCH" className="text-base">APCH (Approach)</SelectItem>
                    <SelectItem value="CLIMB AREA" className="text-base">CLIMB AREA</SelectItem>
                    <SelectItem value="THE FIELD" className="text-base">THE FIELD</SelectItem>
                    <SelectItem value="NORTH" className="text-base">NORTH (Utara)</SelectItem>
                    <SelectItem value="SOUTH" className="text-base">SOUTH (Selatan)</SelectItem>
                    <SelectItem value="EAST" className="text-base">EAST (Timur)</SelectItem>
                    <SelectItem value="WEST" className="text-base">WEST (Barat)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Cuaca Bermakna</Label>
                <Select value={data.supplementaryInfo?.sigWeather || "none"} onValueChange={(v) => handleSupplementaryInfo("sigWeather", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="WS" className="text-base">WS (Wind Shear)</SelectItem>
                    <SelectItem value="RERA" className="text-base">RERA (Recent Rain)</SelectItem>
                    <SelectItem value="RETS" className="text-base">RETS (Recent Thunderstorm)</SelectItem>
                    <SelectItem value="REDZ" className="text-base">REDZ (Recent Drizzle)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Arah Runway</Label>
                <Select value={data.supplementaryInfo?.runway || "none"} onValueChange={(v) => handleSupplementaryInfo("runway", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="RWY 14" className="text-base">RWY 14 (Runway 14)</SelectItem>
                    <SelectItem value="RWY 32" className="text-base">RWY 32 (Runway 32)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Trend Forecast */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Tren Prakiraan</h3>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Trend</Label>
                <Select value={data.trendForecast?.trend1 || "none"} onValueChange={(v) => handleTrendForecast("trend1", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="TREND" className="text-base">TREND (Trend)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">Perubahan</Label>
                <Select value={data.trendForecast?.trend2 || "none"} onValueChange={(v) => handleTrendForecast("trend2", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="BECMG" className="text-base">BECMG (Becoming)</SelectItem>
                    <SelectItem value="TEMPO" className="text-base">TEMPO (Temporary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5 min-w-0">
                <Label className="text-xs lg:text-[13px] font-semibold whitespace-nowrap">No Sig</Label>
                <Select value={data.trendForecast?.trend3 || "none"} onValueChange={(v) => handleTrendForecast("trend3", v || "")}>
                  <SelectTrigger className="h-10 text-base font-medium"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-base">- NIL -</SelectItem>
                    <SelectItem value="NOSIG" className="text-base">NOSIG (No Significant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator className="my-2 border-2" />

          {/* Remarks */}
          <section className="flex gap-3">
            <div className="w-24 lg:w-28 shrink-0 pt-1">
              <h3 className="text-[13px] lg:text-sm font-bold text-muted-foreground uppercase tracking-wider leading-tight break-words">Catatan</h3>
            </div>
            <div className="flex-1 space-y-0.5">
              <Label className="text-base font-semibold">Catatan / Remarks</Label>
              <Input 
                className="h-10 text-base"
                placeholder="Tulis catatan pelaporan..." 
                value={data.remarks} 
                onChange={(e) => handleChange("remarks", e.target.value)} 
              />
            </div>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
