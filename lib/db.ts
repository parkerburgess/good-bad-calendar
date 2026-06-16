import sql from "mssql";

declare global {
  // eslint-disable-next-line no-var
  var _sqlPool: sql.ConnectionPool | undefined;
}

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!global._sqlPool || !global._sqlPool.connected) {
    global._sqlPool = await new sql.ConnectionPool(process.env.DB_CONNECTION_STRING!).connect();
  }
  return global._sqlPool;
}
