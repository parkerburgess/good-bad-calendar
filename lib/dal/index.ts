import { jsonDataAccess } from "@/lib/dal/json";
import type { IDataAccess } from "@/lib/dal/types";

export const dal: IDataAccess = jsonDataAccess;
export type { CategoryName, DayEntry, IDataAccess } from "@/lib/dal/types";
