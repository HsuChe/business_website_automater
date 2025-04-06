export interface DeploymentConfig {
  environment: 'development' | 'production';
  baseUrl: string;
  apiKey: string;
  vercelToken?: string;
  vercelTeamId?: string;
  vercelProjectId?: string;
}

export interface DeploymentResult {
  deploymentId: string;
  success: boolean;
  status: 'pending' | 'deployed' | 'failed';
  url: string;
  environment: 'development' | 'production';
  timestamp: string;
  error?: string;
  metadata?: {
    subdomain: string;
    templateId: string;
    leadId: string;
    [key: string]: any;
  };
}

export interface DeploymentOptions {
  templateId: string;
  leadId: string;
  subdomain: string;
  environment: 'development' | 'production';
  metadata?: Record<string, any>;
}

export interface DeploymentStatus {
  id: string;
  status: 'pending' | 'deployed' | 'failed';
  url?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

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

export interface GeneratedWebsite {
  html: string;
  css: string;
  assets: Asset[];
  metadata: WebsiteMetadata;
}

export interface Asset {
  id: string;
  type: 'image' | 'font' | 'script' | 'style';
  filename: string;
  content: string | ArrayBuffer;
  size: number;
  mimeType: string;
}

export interface WebsiteMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  version: string;
  generatedAt: string;
  template: {
    id: string;
    name: string;
    version: string;
  };
}

export interface LocalDeploymentConfig {
  port: number;
  host: string;
  ssl: boolean;
  sslCert?: string;
  sslKey?: string;
}

export interface VercelDeploymentConfig {
  projectName: string;
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  env: Record<string, string>;
} 