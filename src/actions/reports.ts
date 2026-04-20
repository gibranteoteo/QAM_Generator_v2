"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { weatherReports } from "@/db/schema";
import { desc } from "drizzle-orm";
import { WeatherReportData } from "@/lib/types";

export async function saveWeatherReport(data: WeatherReportData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Insert to DB
    const id = crypto.randomUUID();

    await db.insert(weatherReports).values({
      id,
      userId: session.user.id,
      reportType: data.reportType,
      reportTime: data.reportTime,
      windDirection: data.windDirection,
      windSpeed: data.windSpeed,
      visibilityValue: data.visibilityValue,
      visibilityUnit: data.visibilityUnit,
      presentWeatherJSON: JSON.stringify(data.presentWeather),
      supplementaryInfoJSON: JSON.stringify(data.supplementaryInfo),
      trendForecastJSON: JSON.stringify(data.trendForecast),
      cloudAmount: data.cloudAmount,
      cloudType: data.cloudType,
      cloudHeight: data.cloudHeight,
      temperature: data.temperature,
      dewPoint: data.dewPoint,
      pressureQnh: data.pressureQnh,
      pressureQff: data.pressureQff,
      observerName: data.observerName,
      remarks: data.remarks,
      createdAt: new Date(),
    });

    return { success: true, id };
  } catch (error) {
    console.error("Failed to save report:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getWeatherReports() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized", data: [] };
    }

    const data = await db.select()
      .from(weatherReports)
      .orderBy(desc(weatherReports.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return { success: false, error: "Internal Server Error", data: [] };
  }
}
