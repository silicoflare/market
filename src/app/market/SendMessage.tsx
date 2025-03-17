"use client";

import { SendIcon } from "lucide-react";
import { useState } from "react";
import { addFile, addText } from "./fx";

export default function SendMessage() {
  const [type, setType] = useState<"file" | "text">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function onSubmit() {
    if (type === "text") {
      await addText(text);
    } else {
      await addFile(file!);
    }

    setText("");
    setFile(null);
  }

  return (
    <div className="fixed bottom-0 left-0 px-3 pb-3 w-full">
      <div className="navbar bg-base-100 shadow-sm w-full rounded-md">
        <div className="flex items-center justify-between w-full gap-2">
          <select
            className="select w-1/5"
            value={type}
            onChange={(e) => {
              setText("");
              setFile(null);
              setType(e.target.value as "text" | "file");
            }}
          >
            <option value="text">Text</option>
            <option value="file">File</option>
          </select>
          {type === "text" ? (
            <input
              type="text"
              placeholder="Type here"
              className="input grow"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <div className="flex items-center grow">
              <input
                type="file"
                className="file-input hidden"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <label htmlFor="file-upload" className="btn btn-outline grow">
                {file ? file.name : "Choose a file"}
              </label>
            </div>
          )}
          <button
            className="btn btn-primary btn-circle"
            disabled={type === "text" ? text.trim() === "" : file === null}
            onClick={async () => await onSubmit()}
          >
            <SendIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
