import { Handler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", `warn`, `error`],
});

export const handler: Handler = async () => {
    return await prisma.$queryRaw`SELECT 1`;
};
