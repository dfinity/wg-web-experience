import * as path from "@std/path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));
const ROOT_DIR = path.join(SCRIPT_DIR, "..");
const REFS_DIR = path.join(ROOT_DIR, "refs");

const urls = [
  {
    url:
      "https://raw.githubusercontent.com/dfinity/portal/refs/heads/master/docs/references/http-gateway-protocol-spec.md",
    fileName: "http-gateway-protocol-spec.md",
  },
  {
    url:
      "https://raw.githubusercontent.com/dfinity/portal/refs/heads/master/docs/references/ic-interface-spec.md",
    fileName: "ic-interface-spec.md",
  },
  {
    url:
      "https://raw.githubusercontent.com/dfinity/internet-identity/refs/heads/main/docs/ii-spec.mdx",
    fileName: "ii-spec.mdx",
  },
  {
    url: "https://www.rfc-editor.org/rfc/rfc9421.txt",
    fileName: "rfc9421-http-message-signatures.txt",
  },
  {
    url: "https://www.rfc-editor.org/rfc/rfc7517.txt",
    fileName: "rfc7517-json-web-key.txt",
  },
  {
    url: "https://www.rfc-editor.org/rfc/rfc4648.txt",
    fileName: "rfc4648-base64url.txt",
  },
  {
    url:
      "https://raw.githubusercontent.com/whatwg/fetch/refs/heads/main/fetch.bs",
    fileName: "fetch.bs",
  },
];

try {
  Deno.mkdirSync(REFS_DIR, { recursive: true });

  await Promise.all(
    urls.map(async ({ url, fileName }) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch URL ${url}: ${response.status} ${response.statusText}`,
        );
      }
      if (!response.body) {
        throw new Error(`Response body for URL ${url} is empty.`);
      }

      const filePath = path.join(REFS_DIR, fileName);
      await pipeline(response.body, createWriteStream(filePath));
      console.log(`✅ File downloaded successfully to ${filePath}`);
    }),
  );
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ An error occurred:", errorMessage);
}
