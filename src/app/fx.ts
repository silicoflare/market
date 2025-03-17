"use server";

import db from "@/lib/db";

export async function userExists(username: string) {
  return !!(await db.user.findFirst({
    where: {
      username,
    },
  }));
}
