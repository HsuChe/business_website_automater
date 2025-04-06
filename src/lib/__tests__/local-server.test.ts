import { LocalDevelopmentServer } from '../services/local-server';
import { DeploymentConfig } from '../types/deployment';

jest.mock('express');
jest.mock('https');
jest.mock('fs');

describe('LocalDevelopmentServer', () => {
  let server: LocalDevelopmentServer;
  const mockConfig = {
    port: 3001,
    host: 'localhost',
    ssl: {
      enabled: true,
      keyPath: '/path/to/key.pem',
      certPath: '/path/to/cert.pem',
    },
  };

  beforeEach(() => {
    server = new LocalDevelopmentServer(mockConfig);
  });

  describe('start', () => {
    it('should start the server successfully', async () => {
      const result = await server.start();
      expect(result).toBe(true);
    });

    it('should handle SSL certificate errors', async () => {
      // Mock SSL certificate error
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
      
      const result = await server.start();
      expect(result).toBe(false);
    });
  });

  describe('stop', () => {
    it('should stop the server successfully', async () => {
      await server.start();
      const result = await server.stop();
      expect(result).toBe(true);
    });

    it('should handle errors when stopping the server', async () => {
      // Mock server stop error
      jest.spyOn(server as any, 'server').mockImplementation(() => {
        throw new Error('Failed to stop server');
      });

      const result = await server.stop();
      expect(result).toBe(false);
    });
  });

  describe('getUrl', () => {
    it('should return correct URL for development environment', () => {
      const url = server.getUrl('test');
      expect(url).toBe('https://test.localhost:3001');
    });

    it('should return correct URL for production environment', () => {
      const url = server.getUrl('test', 'production');
      expect(url).toBe('https://test.localhost:3001');
    });
  });

  describe('isRunning', () => {
    it('should return true when server is running', async () => {
      await server.start();
      expect(server.isRunning()).toBe(true);
    });

    it('should return false when server is not running', () => {
      expect(server.isRunning()).toBe(false);
    });
  });
}); 