export type ReportType = "MET REPORT" | "SPECIAL";

export interface PresentWeather {
  intensity: string; // FBL, MOD, HVY
  descriptor: string; // BL, SH, TS
  precipitation: string; // DZ, RA
  obscuration: string; // BR, FG, FU, VA, DU, SA, HZ
}

export interface SupplementaryInfo {
  cbInfo: string;
  cbPosition: string;
  cbDirection: string;
  sigWeather: string;
  runway: string;
}

export interface TrendForecast {
  trend1: string;
  trend2: string;
  trend3: string;
}

export interface WeatherReportData {
  reportType: ReportType;
  reportTime: string; 
  windDirection: string; // 0-350 kelipatan 10
  windSpeed: string; 
  visibilityValue: string; 
  visibilityUnit: "m" | "km";
  presentWeather: PresentWeather;
  supplementaryInfo: SupplementaryInfo;
  trendForecast: TrendForecast;
  cloudAmount: string; // FEW, SCT, BKN, OVC
  cloudType: string; // CB, TCU, etc
  cloudHeight: string; // NSD, 800-2000
  temperature: string; // 18-37
  dewPoint: string; // 18-37
  pressureQnh: string; // hPa
  pressureQff: string; // hPa
  observerName: string;
  remarks: string;
}

export const initialWeatherData: WeatherReportData = {
  reportType: "MET REPORT",
  reportTime: new Date().toISOString().slice(0, 16),
  windDirection: "",
  windSpeed: "",
  visibilityValue: "",
  visibilityUnit: "m",
  presentWeather: {
    intensity: "",
    descriptor: "",
    precipitation: "",
    obscuration: "",
  },
  supplementaryInfo: {
    cbInfo: "",
    cbPosition: "",
    cbDirection: "",
    sigWeather: "",
    runway: "",
  },
  trendForecast: {
    trend1: "",
    trend2: "",
    trend3: "",
  },
  cloudAmount: "",
  cloudType: "",
  cloudHeight: "",
  temperature: "",
  dewPoint: "",
  pressureQnh: "",
  pressureQff: "",
  observerName: "Meteorologist",
  remarks: "",
};
