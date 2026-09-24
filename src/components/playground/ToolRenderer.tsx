"use client";

import AesGcmTool from "./AesGcmTool";
import ShaAvalancheTool from "./ShaAvalancheTool";
import HmacTool from "./HmacTool";
import RsaOaepTool from "./RsaOaepTool";
import EcdsaTool from "./EcdsaTool";
import EcdhTool from "./EcdhTool";
import JwtTool from "./JwtTool";
import Pbkdf2Tool from "./Pbkdf2Tool";
import CertChainTool from "./CertChainTool";
import X3dhTool from "./X3dhTool";

const toolComponents: Record<string, React.ComponentType> = {
  "aes-gcm": AesGcmTool,
  "sha-256": ShaAvalancheTool,
  hmac: HmacTool,
  "rsa-oaep": RsaOaepTool,
  ecdsa: EcdsaTool,
  ecdh: EcdhTool,
  jwt: JwtTool,
  pbkdf2: Pbkdf2Tool,
  "cert-chain": CertChainTool,
  x3dh: X3dhTool,
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  if (!Tool) return null;
  return <Tool />;
}
