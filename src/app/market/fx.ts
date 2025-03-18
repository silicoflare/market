"use server";

import db from "@/lib/db";
import { filestore } from "@/lib/storage";
import { Asset, AssetType } from "@prisma/client";
import { lookup } from "mime-types";
import { getServerSession } from "next-auth";
import { getSession } from "../api/auth/[...nextauth]/config";
import download from "downloadjs";

export async function addText(text: string) {
  const user = await getSession();

  await db.asset.create({
    data: {
      sentBy: {
        connect: {
          username: user!.id,
        },
      },
      type: "text",
      data: text,
    },
  });
}

export async function addFile(data: File) {
  const user = await getSession();

  const created = await db.asset.create({
    data: {
      sentBy: {
        connect: {
          username: user!.id,
        },
      },
      type: "file",
      data: data.name,
    },
  });

  await filestore.uploadFile(
    "files",
    `${user!.id}/${created.id}-${data.name}`,
    lookup(data.name) as string,
    Buffer.from(await data.arrayBuffer())
  );
}

export async function getAssets() {
  const user = await getSession();

  const assets = await db.asset.findMany();

  const data: (Omit<Asset, "data"> & { data: string; file?: Uint8Array })[] =
    [];

  for (let x of assets) {
    data.push({
      id: x.id,
      senderID: x.senderID,
      type: x.type,
      time: x.time,
      data: x.data!,
      file:
        x.type === "file"
          ? await filestore.getFile("files", `${x.senderID}/${x.id}-${x.data}`)
          : undefined,
    });
  }

  return data;
}
