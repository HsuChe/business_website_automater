import { MonitoringService } from '../services/monitoring-service';
import { DeploymentConfig, DeploymentResult } from '../types/deployment';

describe('MonitoringService', () => {
  let monitoringService: MonitoringService;
  const mockConfig: DeploymentConfig = {
    environment: 'development',
    baseUrl: 'http://localhost:3000',
    apiKey: 'test-api-key',
  };

  beforeEach(() => {
    monitoringService = new MonitoringService(mockConfig);
  });

  describe('logDeployment', () => {
    it('should log successful deployment', () => {
      const mockDeployment: DeploymentResult = {
        deploymentId: 'test-deployment',
        success: true,
        status: 'deployed',
        url: 'http://test.localhost:3000',
        environment: 'development',
        timestamp: new Date().toISOString(),
      };

      monitoringService.logDeployment(mockDeployment);
      const logs = monitoringService.getLogs();
      
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('info');
      expect(logs[0].message).toContain('Deployment successful');
    });

    it('should log failed deployment', () => {
      const mockDeployment: DeploymentResult = {
        deploymentId: 'test-deployment',
        success: false,
        status: 'failed',
        url: 'http://test.localhost:3000',
        environment: 'development',
        timestamp: new Date().toISOString(),
        error: 'Deployment failed',
      };

      monitoringService.logDeployment(mockDeployment);
      const logs = monitoringService.getLogs({ level: 'error' });
      
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe('error');
      expect(logs[0].message).toContain('Deployment failed');
    });
  });

  describe('getMetrics', () => {
    it('should return correct metrics after multiple deployments', () => {
      const successfulDeployment: DeploymentResult = {
        deploymentId: 'success-deployment',
        success: true,
        status: 'deployed',
        url: 'http://success.localhost:3000',
        environment: 'development',
        timestamp: new Date().toISOString(),
      };

      const failedDeployment: DeploymentResult = {
        deploymentId: 'failed-deployment',
        success: false,
        status: 'failed',
        url: 'http://failed.localhost:3000',
        environment: 'production',
        timestamp: new Date().toISOString(),
        error: 'Deployment failed',
      };

      monitoringService.logDeployment(successfulDeployment);
      monitoringService.logDeployment(failedDeployment);

      const metrics = monitoringService.getMetrics();
      
      expect(metrics.totalDeployments).toBe(2);
      expect(metrics.successfulDeployments).toBe(1);
      expect(metrics.failedDeployments).toBe(1);
      expect(metrics.deploymentsByEnvironment.development).toBe(1);
      expect(metrics.deploymentsByEnvironment.production).toBe(1);
    });
  });

  describe('getLogs', () => {
    it('should filter logs by deployment ID', () => {
      const deployment1: DeploymentResult = {
        deploymentId: 'deployment-1',
        success: true,
        status: 'deployed',
        url: 'http://test1.localhost:3000',
        environment: 'development',
        timestamp: new Date().toISOString(),
      };

      const deployment2: DeploymentResult = {
        deploymentId: 'deployment-2',
        success: true,
        status: 'deployed',
        url: 'http://test2.localhost:3000',
        environment: 'development',
        timestamp: new Date().toISOString(),
      };

      monitoringService.logDeployment(deployment1);
      monitoringService.logDeployment(deployment2);

      const logs = monitoringService.getLogs({ deploymentId: 'deployment-1' });
      
      expect(logs.length).toBe(1);
      expect(logs[0].deploymentId).toBe('deployment-1');
    });

    it('should limit the number of logs returned', () => {
      // Create more than 10 deployments
      for (let i = 0; i < 15; i++) {
        const deployment: DeploymentResult = {
          deploymentId: `deployment-${i}`,
          success: true,
          status: 'deployed',
          url: `http://test${i}.localhost:3000`,
          environment: 'development',
          timestamp: new Date().toISOString(),
        };
        monitoringService.logDeployment(deployment);
      }

      const logs = monitoringService.getLogs({ limit: 10 });
      
      expect(logs.length).toBe(10);
    });
  });
}); 