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
import TlsKeyScheduleTool from "./TlsKeyScheduleTool";
import EnvelopeEncryptionTool from "./EnvelopeEncryptionTool";
import CertRevocationTool from "./CertRevocationTool";

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
  "tls-key-schedule": TlsKeyScheduleTool,
  "envelope-encryption": EnvelopeEncryptionTool,
  "cert-revocation": CertRevocationTool,
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  if (!Tool) return null;
  return <Tool />;
}
