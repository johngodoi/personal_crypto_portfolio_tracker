import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { env } from './config/env';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const traceExporter = new OTLPTraceExporter({
  url: env.OTLP_ENDPOINT,
});

const sdk = new NodeSDK({
  traceExporter,
  serviceName: env.APP_NAME,
  instrumentations: [getNodeAutoInstrumentations()],
});

async function initializeTracing() {
  try {
    await sdk.start();
    console.log('Tracing initialized');
  } catch (error: any) {
    console.log('Error initializing tracing', error);
  }
}

initializeTracing();

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});