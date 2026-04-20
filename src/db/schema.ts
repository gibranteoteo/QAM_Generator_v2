import { pgTable, text, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires")
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at")
});

export const weatherReports = pgTable("weather_reports", {
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
  createdAt: timestamp("created_at").notNull()
});
