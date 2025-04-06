import React from 'react';
import { Container } from '@mui/material';
import { DeploymentDashboard } from '../components/DeploymentDashboard';
import { MonitoringService } from '../lib/services/monitoring-service';
import { DeploymentConfig } from '../lib/types/deployment';

const deploymentConfig: DeploymentConfig = {
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
};

const monitoringService = new MonitoringService(deploymentConfig);

export default function DeploymentsPage() {
  return (
    <Container maxWidth="xl">
      <DeploymentDashboard monitoringService={monitoringService} />
    </Container>
  );
} 