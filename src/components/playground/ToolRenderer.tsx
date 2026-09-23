"use client";

import AesGcmTool from "./AesGcmTool";
import ShaAvalancheTool from "./ShaAvalancheTool";
import HmacTool from "./HmacTool";
import RsaOaepTool from "./RsaOaepTool";
import EcdsaTool from "./EcdsaTool";
import EcdhTool from "./EcdhTool";
import JwtTool from "./JwtTool";

const toolComponents: Record<string, React.ComponentType> = {
  "aes-gcm": AesGcmTool,
  "sha-256": ShaAvalancheTool,
  hmac: HmacTool,
  "rsa-oaep": RsaOaepTool,
  ecdsa: EcdsaTool,
  ecdh: EcdhTool,
  jwt: JwtTool,
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  if (!Tool) return null;
  return <Tool />;
}
