import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
					id: text("id").primaryKey(),
					name: text("name").notNull(),
					email: text("email").notNull().unique(),
					emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
					image: text("image"),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
					role: text("role"),
					banned: integer("banned", { mode: "boolean" }),
					banReason: text("banReason"),
					banExpires: integer("banExpires", { mode: "timestamp" })
});

export const session = sqliteTable("session", {
					id: text("id").primaryKey(),
					expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
					token: text("token").notNull().unique(),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
					ipAddress: text("ipAddress"),
					userAgent: text("userAgent"),
					userId: text("userId").notNull().references(() => user.id)
});

export const account = sqliteTable("account", {
					id: text("id").primaryKey(),
					accountId: text("accountId").notNull(),
					providerId: text("providerId").notNull(),
					userId: text("userId").notNull().references(() => user.id),
					accessToken: text("accessToken"),
					refreshToken: text("refreshToken"),
					idToken: text("idToken"),
					accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
					refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
					scope: text("scope"),
					password: text("password"),
					createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
					updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull()
});

export const verification = sqliteTable("verification", {
					id: text("id").primaryKey(),
					identifier: text("identifier").notNull(),
					value: text("value").notNull(),
					expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
					createdAt: integer("createdAt", { mode: "timestamp" }),
					updatedAt: integer("updatedAt", { mode: "timestamp" })
});

export const weatherReports = sqliteTable("weather_reports", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  reportType: text("report_type").notNull(), // MET REPORT / SPECIAL
  reportTime: text("report_time").notNull(), // ISO string or datetime
  windDirection: text("wind_direction"),
  windSpeed: text("wind_speed"),
  visibilityValue: text("visibility_value"),
  visibilityUnit: text("visibility_unit"), // m or km
  presentWeatherJSON: text("present_weather_json"), // stringified JSON
  supplementaryInfoJSON: text("supplementary_info_json"), // stringified JSON
  trendForecastJSON: text("trend_forecast_json"), // stringified JSON
  cloudAmount: text("cloud_amount"),
  cloudType: text("cloud_type"),
  cloudHeight: text("cloud_height"),
  temperature: text("temperature"),
  dewPoint: text("dew_point"),
  pressureQnh: text("pressure_qnh"),
  pressureQff: text("pressure_qff"),
  observerName: text("observer_name"),
  remarks: text("remarks"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull()
});
