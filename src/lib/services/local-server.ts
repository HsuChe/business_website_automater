import express from 'express';
import { createServer } from 'http';
import { LocalDeploymentConfig } from '../types/deployment';
import path from 'path';
import fs from 'fs/promises';

export class LocalDevelopmentServer {
  private app: express.Application;
  private server: any;
  private config: LocalDeploymentConfig;
  private deployments: Map<string, string>;

  constructor(config: LocalDeploymentConfig) {
    this.config = config;
    this.app = express();
    this.deployments = new Map();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    // Parse subdomain from host header
    this.app.use((req, res, next) => {
      const host = req.hostname;
      const subdomain = host.split('.')[0];
      
      if (subdomain !== 'localhost' && subdomain !== 'www') {
        req.subdomain = subdomain;
      }
      
      next();
    });
  }

  private setupRoutes() {
    // Handle subdomain routes
    this.app.use((req, res, next) => {
      if (req.subdomain) {
        const deploymentPath = this.deployments.get(req.subdomain);
        if (deploymentPath) {
          // Serve static files from the deployment directory
          express.static(deploymentPath)(req, res, next);
          return;
        }
      }
      next();
    });

    // Default route for localhost
    this.app.get('/', (req, res) => {
      res.send('Local Development Server Running');
    });
  }

  async start() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.server = createServer(this.app);
        
        if (this.config.ssl) {
          // Setup SSL if configured
          const https = require('https');
          const options = {
            key: fs.readFileSync(this.config.sslKey!),
            cert: fs.readFileSync(this.config.sslCert!)
          };
          this.server = https.createServer(options, this.app);
        }

        this.server.listen(this.config.port, () => {
          console.log(`Local development server running on port ${this.config.port}`);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop() {
    return new Promise<void>((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('Local development server stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async addDeployment(subdomain: string, deploymentPath: string) {
    // Validate deployment path exists
    try {
      await fs.access(deploymentPath);
      this.deployments.set(subdomain, deploymentPath);
      console.log(`Added deployment for subdomain ${subdomain} at ${deploymentPath}`);
    } catch (error) {
      throw new Error(`Deployment path ${deploymentPath} does not exist`);
    }
  }

  async removeDeployment(subdomain: string) {
    this.deployments.delete(subdomain);
    console.log(`Removed deployment for subdomain ${subdomain}`);
  }

  getDeploymentPath(subdomain: string): string | undefined {
    return this.deployments.get(subdomain);
  }

  listDeployments(): Map<string, string> {
    return new Map(this.deployments);
  }
} 