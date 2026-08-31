export type PathType = "TIEN_HIEP" | "MA_DAO" | "KY_AO";

export interface LevelConfig {
  level: number;
  expRequired: number;
  titles: Record<PathType, string>;
}

export const PATH_NAMES: Record<PathType, string> = {
  TIEN_HIEP: "Tu Tiên",
  MA_DAO: "Ma Đạo",
  KY_AO: "Kỳ Ảo",
};

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, expRequired: 0, titles: { TIEN_HIEP: "Phàm Nhân", MA_DAO: "Tiểu Quỷ", KY_AO: "Tập Sự" } },
  { level: 2, expRequired: 200, titles: { TIEN_HIEP: "Luyện Khí", MA_DAO: "Ma Binh", KY_AO: "Chiến Binh" } },
  { level: 3, expRequired: 500, titles: { TIEN_HIEP: "Trúc Cơ", MA_DAO: "Ma Tướng", KY_AO: "Tinh Anh" } },
  { level: 4, expRequired: 1000, titles: { TIEN_HIEP: "Kết Đan", MA_DAO: "Huyết Ma", KY_AO: "Kỵ Sĩ" } },
  { level: 5, expRequired: 2500, titles: { TIEN_HIEP: "Nguyên Anh", MA_DAO: "Ma Sứ", KY_AO: "Thánh Kỵ Sĩ" } },
  { level: 6, expRequired: 5000, titles: { TIEN_HIEP: "Hóa Thần", MA_DAO: "Ma Vương", KY_AO: "Đại Tông Sư" } },
  { level: 7, expRequired: 10000, titles: { TIEN_HIEP: "Luyện Hư", MA_DAO: "Đại Ma Vương", KY_AO: "Anh Hùng" } },
  { level: 8, expRequired: 25000, titles: { TIEN_HIEP: "Hợp Thể", MA_DAO: "Ma Tôn", KY_AO: "Bán Thần" } },
  { level: 9, expRequired: 50000, titles: { TIEN_HIEP: "Đại Thừa", MA_DAO: "Ma Đế", KY_AO: "Chân Thần" } },
  { level: 10, expRequired: 100000, titles: { TIEN_HIEP: "Độ Kiếp", MA_DAO: "Vô Thượng Ma Thần", KY_AO: "Sáng Thế Thần" } },
];

export function getUserLevel(exp: number): LevelConfig {
  let currentLevel = LEVEL_CONFIGS[0];
  for (const config of LEVEL_CONFIGS) {
    if (exp >= config.expRequired) {
      currentLevel = config;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevelExp(exp: number): number | null {
  for (const config of LEVEL_CONFIGS) {
    if (config.expRequired > exp) {
      return config.expRequired;
    }
  }
  return null; // Max level
}

export function getUserTitle(exp: number, path: PathType): string {
  const level = getUserLevel(exp);
  return level.titles[path] || level.titles.TIEN_HIEP;
}
