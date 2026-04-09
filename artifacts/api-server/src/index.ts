import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const isSandbox = process.env.FLOW_SANDBOX === "true";
const hasFlow = !!(process.env.FLOW_API_KEY && process.env.FLOW_SECRET_KEY);

if (hasFlow) {
  logger.info({ sandbox: isSandbox }, "Flow payment gateway configured");
} else {
  logger.warn("FLOW_API_KEY / FLOW_SECRET_KEY not set — payments in mock mode");
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
