import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  log: ["error", "warn"],
});

export default db;
