"use client";

import React, { forwardRef } from "react";
import { WeatherReportData } from "@/lib/types";

interface A4PreviewProps {
  data: WeatherReportData;
}

const A4Preview = forwardRef<HTMLDivElement, A4PreviewProps>(({ data }, ref) => {
  let formattedTime = "";
  if (data.reportTime && data.reportTime.includes("T")) {
    const [date, time] = data.reportTime.split("T");
    const day = date.split("-")[2];
    const timeStr = time.replace(":", "");
    formattedTime = `${day} ${timeStr} \u00A0Z`;
  }
  
  const calculateInches = (hpa: string) => {
    if (!hpa) return "";
    const num = parseFloat(hpa);
    if (isNaN(num)) return "";
    return (num * 0.02953).toFixed(2);
  };

  const presentWeatherStr = [
    data.presentWeather.intensity,
    data.presentWeather.descriptor,
    data.presentWeather.precipitation,
    data.presentWeather.obscuration
  ].filter(Boolean).join(" ").trim();

  const cloudStr = [
    "CLD",
    data.cloudAmount,
    data.cloudType,
    data.cloudHeight !== "NSD" ? data.cloudHeight : "",
    data.cloudHeight && data.cloudHeight !== "NSD" ? "FT" : ""
  ].filter(Boolean).join(" ").trim();

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

  return (
    <div 
      ref={ref} 
      className="bg-[#ebfbfc] w-[210mm] min-h-[297mm] p-[10mm] sm:p-[15mm] text-black shadow-none flex flex-col relative font-sans leading-snug"
      style={{
        width: "794px",
        height: "1123px",
        transformOrigin: "top left",
        boxSizing: "border-box"
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-6 mt-2 px-2">
        <div className="w-[110px] shrink-0 flex justify-center z-10">
           <img 
             src="/logo-bmkg.webp" 
             alt="BMKG Logo" 
             className="w-[85px] h-auto object-contain" 
           />
        </div>
        <div className="flex-1 text-center pr-6">
          <h1 className="text-[19px] font-bold uppercase tracking-tight whitespace-nowrap">Badan Meteorologi Klimatologi dan Geofisika</h1>
          <h2 className="text-[16.5px] font-bold mt-1 whitespace-nowrap">Local Routine (MET REPORT) and</h2>
          <h2 className="text-[16.5px] font-bold whitespace-nowrap">Local special (SPECIAL) report</h2>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="flex-1 w-full border-[2.5px] border-black flex flex-col bg-transparent mx-auto font-medium text-base mb-2">
        
        {/* ROW 1 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center pr-10">
            IDENTIFICATION OF THE TYPE OF REPORT
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {data.reportType}
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            LOCATION INDICATOR
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            WIDS
          </div>
        </div>

        {/* ROW 3 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            TIME OF OBSERVATION
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {formattedTime}
          </div>
        </div>

        {/* ROW 4 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            SURFACE WIND, DIRECTION, SPEED AND SIGNIFICANT VARIATION
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {(data.windDirection || data.windSpeed) ? `WIND \u00A0${data.windDirection || "___"} \u00A0/\u00A0 ${data.windSpeed || "___"} \u00A0KT` : ""}
          </div>
        </div>

        {/* ROW 5 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            VISIBILITY
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {data.visibilityValue ? `VIS \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0${data.visibilityValue} \u00A0${data.visibilityUnit}` : ""}
          </div>
        </div>

        {/* ROW 6 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            RUNWAY VISUAL RANGE
          </div>
          <div className="flex-1 p-2 px-4 flex items-center justify-center font-bold">
            -
          </div>
        </div>

        {/* ROW 7 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            PRESENT WEATHER
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {presentWeatherStr}
          </div>
        </div>

        {/* ROW 8 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            CLOUD AMOUNT, TYPE AND HEIGHT OF BASE
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {(data.cloudAmount && data.cloudAmount !== "none") ? cloudStr : ""}
          </div>
        </div>

        {/* ROW 9 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center pr-10">
            AIR TEMPERATURE AND DEW POINT TEMPERATUR
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {(data.temperature || data.dewPoint) ? `T \u00A0\u00A0 ${data.temperature || "__"} \u00A0\u00A0 DP \u00A0\u00A0 ${data.dewPoint || "__"}` : ""}
          </div>
        </div>

        {/* ROW 10 */}
        <div className="flex border-b-[2px] border-black min-h-[140px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            PRESSURE VALUE
          </div>
          <div className="flex-1 p-2 px-4 flex flex-col justify-center space-y-1">
            <div className="flex gap-4 items-center">
              <div className="w-10">QNH</div>
              <div className="w-16">{data.pressureQnh}</div>
              <div>HPA,</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-10">QNH</div>
              <div className="w-16">{calculateInches(data.pressureQnh)}</div>
              <div>INCH *</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-10">QFF</div>
              <div className="w-16">{data.pressureQff}</div>
              <div>HPA,</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-10">QFF</div>
              <div className="w-16">{calculateInches(data.pressureQff)}</div>
              <div>INCH *</div>
            </div>
          </div>
        </div>

        {/* ROW 11 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            SUPPLEMENTARY INFORMATION
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {suppStr}
          </div>
        </div>

        {/* ROW 12 */}
        <div className="flex border-b-[2px] border-black min-h-[45px]">
          <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
            TREND FORECAST
          </div>
          <div className="flex-1 p-2 px-4 uppercase flex items-center">
            {trendStr}
          </div>
        </div>

        {/* ROW 13 - Remarks overlay or additional (Optional string) */}
        {data.remarks && (
          <div className="flex min-h-[45px]">
            <div className="w-[45%] border-r-[2px] border-black p-2 px-3 uppercase flex items-center">
              REMARKS
            </div>
            <div className="flex-1 p-2 px-4 flex items-center">
              {data.remarks}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Signature Area */}
      <div className="mt-1 flex justify-between px-2 font-medium text-base">
        <div className="flex flex-col pt-1">
          <div className="flex gap-8 mb-4">
            <span className="uppercase">TIME OF ISSUE:</span>
            <span className="uppercase">{formattedTime}</span>
          </div>
          <div className="mb-4">
            *on request
          </div>
          <div>
            ME.37a
          </div>
        </div>
        
        <div className="flex flex-col items-center pt-5 pr-10">
           <div className="uppercase font-bold mb-16 tracking-wide">
             OBSERVER,
           </div>
           
           <div className="uppercase font-bold pt-4 text-center">
             {data.observerName || "........................"}
           </div>
        </div>
      </div>

    </div>
  );
});

A4Preview.displayName = "A4Preview";
export default A4Preview;
