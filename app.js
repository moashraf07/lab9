const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3000;

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'k8s-monitoring-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define a custom metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the custom metric
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Monitoring World! Go to /metrics to see Prometheus data.');
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
