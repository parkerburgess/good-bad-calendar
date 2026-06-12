import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

declare global {
  // eslint-disable-next-line no-var
  var _sqlPool: sql.ConnectionPool | undefined;
}

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!global._sqlPool || !global._sqlPool.connected) {
    global._sqlPool = await new sql.ConnectionPool(config).connect();
  }
  return global._sqlPool;
}
