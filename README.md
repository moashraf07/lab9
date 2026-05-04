# Lab 9: Monitoring App using Kubernetes, Prometheus, and Grafana

This project implements a monitoring solution for a Node.js application deployed on Kubernetes using Prometheus and Grafana.

## Project Structure
- `app.js`: Node.js application using `express` and `prom-client` to expose metrics.
- `package.json`: Project dependencies.
- `Dockerfile`: Container configuration.
- `deployment.yaml`: Kubernetes Deployment for the app.
- `service.yaml`: Kubernetes Service to expose the app.
- `service-monitor.yaml`: Prometheus ServiceMonitor configuration.

## Steps to Run

### 1. Build and Push Image
```bash
docker build -t <your-docker-username>/k8s-monitoring-app:latest .
docker push <your-docker-username>/k8s-monitoring-app:latest
```

### 2. Deploy to Kubernetes
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### 3. Setup Monitoring (Helm)
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack
```

### 4. Apply Service Monitor
```bash
kubectl apply -f service-monitor.yaml
```

### 5. Access Dashboards
- **Prometheus**: `kubectl port-forward svc/monitoring-kube-prometheus-prometheus 8080:9090`
- **Grafana**: `kubectl port-forward svc/monitoring-grafana 3000:80`
  - Default user: `admin`
  - Get password: `kubectl get secret monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 --decode`

## Solution Summary
This lab demonstrates how to:
1. Instrument a Node.js app with Prometheus metrics.
2. Containerize and deploy the app to K8s.
3. Use Helm to install the Prometheus/Grafana stack.
4. Configure a ServiceMonitor to let Prometheus scrape the app's metrics.
5. Visualize metrics in Grafana.

## GitHub Actions (Ubuntu Runner)
This project includes a GitHub Workflow that automatically:
1. Sets up an Ubuntu environment.
2. Installs Node.js and dependencies.
3. Tests the metrics endpoint.
4. Validates Kubernetes YAML files.

You can see the results in the **Actions** tab of your GitHub repository.
