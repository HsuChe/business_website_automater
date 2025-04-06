import { DeploymentService } from '../services/deployment-service';
import { DeploymentConfig, DeploymentOptions } from '../types/deployment';

jest.mock('../services/local-server');
jest.mock('../services/monitoring-service');

describe('DeploymentService', () => {
  let deploymentService: DeploymentService;
  const mockConfig: DeploymentConfig = {
    environment: 'development',
    baseUrl: 'http://localhost:3000',
    apiKey: 'test-api-key',
    vercelToken: 'test-vercel-token',
    vercelTeamId: 'test-team-id',
    vercelProjectId: 'test-project-id',
  };

  beforeEach(() => {
    deploymentService = new DeploymentService(mockConfig);
  });

  describe('deployWebsite', () => {
    const mockOptions: DeploymentOptions = {
      templateId: 'test-template',
      leadId: 'test-lead',
      subdomain: 'test',
      environment: 'development',
    };

    it('should successfully deploy a website', async () => {
      const result = await deploymentService.deployWebsite(mockOptions);
      
      expect(result.success).toBe(true);
      expect(result.status).toBe('deployed');
      expect(result.url).toBeDefined();
      expect(result.deploymentId).toBeDefined();
    });

    it('should handle deployment failures', async () => {
      // Mock a failed deployment
      jest.spyOn(deploymentService as any, 'deployToVercel')
        .mockRejectedValue(new Error('Deployment failed'));

      const result = await deploymentService.deployWebsite(mockOptions);
      
      expect(result.success).toBe(false);
      expect(result.status).toBe('failed');
      expect(result.error).toBeDefined();
    });
  });

  describe('getDeploymentStatus', () => {
    it('should return deployment status', async () => {
      const deploymentId = 'test-deployment';
      const status = await deploymentService.getDeploymentStatus(deploymentId);
      
      expect(status).toBeDefined();
      expect(status.id).toBe(deploymentId);
      expect(['pending', 'deployed', 'failed']).toContain(status.status);
    });
  });

  describe('deleteDeployment', () => {
    it('should successfully delete a deployment', async () => {
      const deploymentId = 'test-deployment';
      const result = await deploymentService.deleteDeployment(deploymentId);
      
      expect(result).toBe(true);
    });

    it('should handle deletion failures', async () => {
      // Mock a failed deletion
      jest.spyOn(deploymentService as any, 'deleteFromVercel')
        .mockRejectedValue(new Error('Deletion failed'));

      const deploymentId = 'test-deployment';
      const result = await deploymentService.deleteDeployment(deploymentId);
      
      expect(result).toBe(false);
    });
  });
}); 