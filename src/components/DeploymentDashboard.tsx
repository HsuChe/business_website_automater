import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { MonitoringService, DeploymentMetrics, DeploymentLog } from '../lib/services/monitoring-service';

interface DeploymentDashboardProps {
  monitoringService: MonitoringService;
}

export const DeploymentDashboard: React.FC<DeploymentDashboardProps> = ({ monitoringService }) => {
  const [metrics, setMetrics] = useState<DeploymentMetrics | null>(null);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentMetrics = monitoringService.getMetrics();
      const recentLogs = monitoringService.getLogs({ limit: 10 });
      setMetrics(currentMetrics);
      setLogs(recentLogs);
    } catch (err) {
      setError('Failed to fetch deployment data');
      console.error('Error fetching deployment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon />;
    }
  };

  if (loading && !metrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Deployment Dashboard</Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchData} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Deployments
              </Typography>
              <Typography variant="h4">{metrics?.totalDeployments || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Successful Deployments
              </Typography>
              <Typography variant="h4" color="success.main">
                {metrics?.successfulDeployments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Failed Deployments
              </Typography>
              <Typography variant="h4" color="error.main">
                {metrics?.failedDeployments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Deployments
              </Typography>
              <Typography variant="h4" color="warning.main">
                {metrics?.pendingDeployments || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deployments by Environment
              </Typography>
              <Box display="flex" justifyContent="space-around">
                <Box textAlign="center">
                  <Typography variant="h4" color="primary">
                    {metrics?.deploymentsByEnvironment.development || 0}
                  </Typography>
                  <Typography color="textSecondary">Development</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" color="secondary">
                    {metrics?.deploymentsByEnvironment.production || 0}
                  </Typography>
                  <Typography color="textSecondary">Production</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Deployments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Deployments
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deployment ID</TableCell>
                      <TableCell>Environment</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>URL</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics?.recentDeployments.map((deployment) => (
                      <TableRow key={deployment.deploymentId}>
                        <TableCell>{deployment.deploymentId}</TableCell>
                        <TableCell>{deployment.environment}</TableCell>
                        <TableCell>
                          <Chip
                            label={deployment.status}
                            color={getStatusColor(deployment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            component="a"
                            href={deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {deployment.url}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(deployment.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Logs
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Level</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Deployment ID</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {getLogIcon(log.level)}
                        </TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.deploymentId}</TableCell>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 