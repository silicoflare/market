"use client";

import Navbar from "@/components/Navbar";
import SendMessage from "./SendMessage";
import useSWR from "swr";
import { getAssets } from "./fx";
import { FileIcon, LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { useEffect } from "react";
import copy from "copy-to-clipboard";
import download from "downloadjs";
import { lookup } from "mime-types";
import moment from "moment";

export default function Market() {
  const { data: assets, mutate } = useSWR(
    "assets",
    async () => await getAssets()
  );
  const { data: session } = useSession();

  useEffect(() => {
    console.log(assets);
  }, [assets]);

  return (
    <div className="window">
      <Navbar />
      <div className="w-full h-full flex flex-col justify-end gap-2 overflow-y-scroll mb-32 px-5">
        {!assets ? (
          <LoaderIcon size={20} className="text-primary animate-spin" />
        ) : (
          assets.map((a) => (
            <div
              className={`chat ${
                a.senderID === session?.user.id ? "chat-end" : "chat-start"
              }`}
              key={a.id}
            >
              <div className="chat-header">
                {a.senderID}
                <time className="text-xs opacity-50">
                  {moment(a.time).isSame(moment(), "day")
                    ? moment(a.time).format("h:mm a")
                    : moment(a.time).calendar()}
                </time>
              </div>
              <div
                className={`chat-bubble cursor-pointer ${
                  a.senderID === session?.user.id
                    ? "bg-secondary"
                    : "bg-base-100"
                } hover:underline`}
                onClick={() => {
                  if (a.type === "text") {
                    copy(a.data);
                  } else {
                    download(a.file!, a.data!, lookup(a.data!) as string);
                  }
                }}
              >
                <span className="flex items-center gap-1">
                  {a.type === "file" && <FileIcon size={15} />}
                  {a.data}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <SendMessage />
    </div>
  );
}
