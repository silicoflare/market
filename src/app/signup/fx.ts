"use server";

import db from "@/lib/db";
import { genSaltSync, hashSync } from "bcryptjs";

export async function userExists(username: string) {
  return !!(await db.user.findFirst({
    where: {
      username,
    },
  }));
}

export async function signup(username: string, password: string) {
  await db.user.create({
    data: {
      username,
      password: hashSync(password, genSaltSync()),
    },
  });

  return 200;
}
