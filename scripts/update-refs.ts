import fs from 'node:fs';
import stream from 'node:stream/promises';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', 'refs');

const urls = [
  {
    url: 'https://raw.githubusercontent.com/dfinity/portal/refs/heads/master/docs/references/http-gateway-protocol-spec.md',
    fileName: 'http-gateway-protocol-spec.md',
  },
  {
    url: 'https://raw.githubusercontent.com/dfinity/portal/refs/heads/master/docs/references/ic-interface-spec.md',
    fileName: 'ic-interface-spec.md',
  },
  {
    url: 'https://raw.githubusercontent.com/dfinity/internet-identity/refs/heads/main/docs/ii-spec.mdx',
    fileName: 'ii-spec.mdx',
  },
];

try {
  fs.mkdirSync(rootDir, { recursive: true });

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

      const filePath = path.join(rootDir, fileName);
      await stream.pipeline(response.body, fs.createWriteStream(filePath));
      console.log(`✅ File downloaded successfully to ${filePath}`);
    }),
  );
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('❌ An error occurred:', errorMessage);
}
