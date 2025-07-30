const url = 'http://wg-webexp-ollama:11434/api/pull';

try {
  const args = process.argv.slice(2);

  const modelArg = args.find(arg => arg.startsWith('--model='));
  if (!modelArg) {
    throw new Error('Please provide a model name using --model=<model_name>');
  }

  const model = modelArg.split('=')[1];
  console.log(`🔃 Pulling model: ${model}...`);

  const request: PullModelRequest = {
    model,
    stream: false,
    insecure: true,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    throw new Error(`Failed to pull model: ${res.status} ${res.statusText}`);
  }

  console.log(`✅ Model pull completed successfully.`);
} catch (error) {
  console.error(`❌ Error: ${error.toString()}`);
  process.exit(1);
}

interface PullModelRequest {
  model: string;
  stream?: boolean;
  insecure?: boolean;
}
