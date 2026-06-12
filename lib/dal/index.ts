import { sqlDataAccess } from "@/lib/dal/sql";
import type { IDataAccess } from "@/lib/dal/types";

export const dal: IDataAccess = sqlDataAccess;
export type { CategoryName, Category, DayEntry, IDataAccess } from "@/lib/dal/types";
