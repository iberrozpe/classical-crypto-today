"use client";

import { useEffect, useState } from "react";
import { Field, TextInput, OutputBox, Panel } from "./ui";
import { bufToHex, utf8ToBuf } from "@/lib/webcrypto-utils";

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", utf8ToBuf(text));
  return bufToHex(digest);
}

function hexDiffPercent(a: string, b: string): number {
  if (!a || !b || a.length !== b.length) return 0;
  let diffBits = 0;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    diffBits += x.toString(2).split("1").length - 1;
  }
  return Math.round((diffBits / (a.length * 4)) * 100);
}

export default function ShaAvalancheTool() {
  const [textA, setTextA] = useState("hello");
  const [textB, setTextB] = useState("hellp");
  const [hashA, setHashA] = useState("");
  const [hashB, setHashB] = useState("");

  useEffect(() => {
    sha256Hex(textA).then(setHashA);
  }, [textA]);

  useEffect(() => {
    sha256Hex(textB).then(setHashB);
  }, [textB]);

  const diff = hexDiffPercent(hashA, hashB);

  return (
    <div className="space-y-6">
      <Panel>
        <p className="mb-3 text-sm font-medium text-foreground">
          Type into both boxes and watch the digests below — real SHA-256, computed live in your
          browser via the Web Crypto API.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Input A">
            <TextInput value={textA} onChange={(e) => setTextA(e.target.value)} />
          </Field>
          <Field label="Input B">
            <TextInput value={textB} onChange={(e) => setTextB(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 space-y-3">
          <OutputBox label="SHA-256(A)" value={hashA} />
          <OutputBox label="SHA-256(B)" value={hashB} />
        </div>
      </Panel>

      <Panel>
        <p className="text-sm font-medium text-foreground">Avalanche effect</p>
        <p className="mt-1 text-sm text-muted">
          {textA === textB
            ? "Identical inputs — identical digests, as expected."
            : `About ${diff}% of the output bits differ between these two digests, even though the inputs above may differ by only a character or two. That's the avalanche effect: a well-designed hash function makes the output unpredictable from the input, one bit at a time.`}
        </p>
      </Panel>
    </div>
  );
}
