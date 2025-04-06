import { DeploymentResult, DeploymentConfig } from '../types/deployment';

export interface DeploymentMetrics {
  totalDeployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  pendingDeployments: number;
  averageDeploymentTime: number;
  deploymentsByEnvironment: {
    development: number;
    production: number;
  };
  deploymentsByStatus: {
    deployed: number;
    pending: number;
    failed: number;
  };
  recentDeployments: DeploymentResult[];
}

export interface DeploymentLog {
  id: string;
  deploymentId: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

export class MonitoringService {
  private config: DeploymentConfig;
  private logs: DeploymentLog[] = [];
  private metrics: DeploymentMetrics = {
    totalDeployments: 0,
    successfulDeployments: 0,
    failedDeployments: 0,
    pendingDeployments: 0,
    averageDeploymentTime: 0,
    deploymentsByEnvironment: {
      development: 0,
      production: 0,
    },
    deploymentsByStatus: {
      deployed: 0,
      pending: 0,
      failed: 0,
    },
    recentDeployments: [],
  };

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  logDeployment(deployment: DeploymentResult): void {
    // Add to logs
    this.logs.push({
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deploymentId: deployment.deploymentId || 'unknown',
      timestamp: new Date().toISOString(),
      level: deployment.success ? 'info' : 'error',
      message: deployment.success 
        ? `Deployment successful: ${deployment.url}` 
        : `Deployment failed: ${deployment.error}`,
      details: deployment,
    });

    // Update metrics
    this.updateMetrics(deployment);

    // Keep only the last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    // Keep only the last 10 recent deployments
    if (this.metrics.recentDeployments.length > 10) {
      this.metrics.recentDeployments = this.metrics.recentDeployments.slice(-10);
    }
  }

  private updateMetrics(deployment: DeploymentResult): void {
    // Update total deployments
    this.metrics.totalDeployments++;

    // Update success/failure counts
    if (deployment.success) {
      this.metrics.successfulDeployments++;
    } else {
      this.metrics.failedDeployments++;
    }

    // Update environment counts
    if (deployment.environment === 'development') {
      this.metrics.deploymentsByEnvironment.development++;
    } else {
      this.metrics.deploymentsByEnvironment.production++;
    }

    // Update status counts
    if (deployment.status === 'deployed') {
      this.metrics.deploymentsByStatus.deployed++;
    } else if (deployment.status === 'pending') {
      this.metrics.deploymentsByStatus.pending++;
    } else if (deployment.status === 'failed') {
      this.metrics.deploymentsByStatus.failed++;
    }

    // Add to recent deployments
    this.metrics.recentDeployments.push(deployment);
  }

  getLogs(options: {
    deploymentId?: string;
    level?: 'info' | 'warning' | 'error';
    limit?: number;
  } = {}): DeploymentLog[] {
    let filteredLogs = [...this.logs];

    // Filter by deployment ID if provided
    if (options.deploymentId) {
      filteredLogs = filteredLogs.filter(log => log.deploymentId === options.deploymentId);
    }

    // Filter by level if provided
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    // Apply limit if provided
    if (options.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs;
  }

  getMetrics(): DeploymentMetrics {
    return { ...this.metrics };
  }

  getDeploymentStatus(deploymentId: string): DeploymentResult | null {
    const deployment = this.metrics.recentDeployments.find(d => d.deploymentId === deploymentId);
    return deployment || null;
  }

  clearLogs(): void {
    this.logs = [];
  }

  resetMetrics(): void {
    this.metrics = {
      totalDeployments: 0,
      successfulDeployments: 0,
      failedDeployments: 0,
      pendingDeployments: 0,
      averageDeploymentTime: 0,
      deploymentsByEnvironment: {
        development: 0,
        production: 0,
      },
      deploymentsByStatus: {
        deployed: 0,
        pending: 0,
        failed: 0,
      },
      recentDeployments: [],
    };
  }
} 