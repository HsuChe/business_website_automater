import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useApi } from '../lib/api-context';
import { DeploymentResult, GeneratedWebsite } from '../lib/types/deployment';

interface Deployment {
  id: string;
  leadId: number;
  subdomain: string;
  url: string;
  status: 'pending' | 'deployed' | 'failed';
  createdAt: string;
  updatedAt: string;
  environment: 'development' | 'production';
  thumbnail?: string;
  metadata: {
    title: string;
    description: string;
    template: {
      id: string;
      name: string;
    };
  };
}

interface DeploymentManagerProps {
  leadId?: number;
  onDeploymentComplete?: (deployment: Deployment) => void;
}

export default function DeploymentManager({ leadId, onDeploymentComplete }: DeploymentManagerProps) {
  const api = useApi();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subdomain, setSubdomain] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [environment, setEnvironment] = useState<'development' | 'production'>('development');

  useEffect(() => {
    fetchDeployments();
    fetchTemplates();
  }, [leadId]);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would call the API
      // For now, we'll use mock data
      const mockDeployments: Deployment[] = [
        {
          id: 'deploy-1',
          leadId: 1,
          subdomain: 'acme',
          url: 'http://acme.localhost:3001',
          status: 'deployed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          environment: 'development',
          thumbnail: 'https://via.placeholder.com/300x200',
          metadata: {
            title: 'Acme Corp Website',
            description: 'Professional website for Acme Corporation',
            template: {
              id: 'template-1',
              name: 'Modern Business',
            },
          },
        },
        {
          id: 'deploy-2',
          leadId: 2,
          subdomain: 'techstart',
          url: 'http://techstart.localhost:3001',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          environment: 'development',
          metadata: {
            title: 'TechStart Website',
            description: 'Startup website for TechStart',
            template: {
              id: 'template-2',
              name: 'Startup Landing',
            },
          },
        },
      ];
      
      // Filter by leadId if provided
      const filteredDeployments = leadId 
        ? mockDeployments.filter(d => d.leadId === leadId)
        : mockDeployments;
        
      setDeployments(filteredDeployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
      setError('Failed to load deployments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      // In a real app, this would call the API
      // For now, we'll use mock data
      const mockTemplates = [
        { id: 'template-1', name: 'Modern Business', description: 'Professional template for established businesses' },
        { id: 'template-2', name: 'Startup Landing', description: 'Modern landing page for startups' },
        { id: 'template-3', name: 'E-commerce', description: 'Full-featured e-commerce template' },
      ];
      
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleDeploy = async () => {
    if (!selectedTemplate || !subdomain) {
      setDeployError('Please select a template and provide a subdomain');
      return;
    }

    try {
      setDeploying(true);
      setDeployError(null);
      
      // In a real app, this would call the API
      // For now, we'll simulate a deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDeployment: Deployment = {
        id: `deploy-${Date.now()}`,
        leadId: leadId || 0,
        subdomain,
        url: `http://${subdomain}.localhost:3001`,
        status: 'deployed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        environment,
        thumbnail: 'https://via.placeholder.com/300x200',
        metadata: {
          title: `${subdomain} Website`,
          description: `Website for ${subdomain}`,
          template: {
            id: selectedTemplate,
            name: templates.find(t => t.id === selectedTemplate)?.name || 'Unknown Template',
          },
        },
      };
      
      setDeployments([...deployments, newDeployment]);
      setShowDeployDialog(false);
      
      if (onDeploymentComplete) {
        onDeploymentComplete(newDeployment);
      }
    } catch (error) {
      console.error('Error deploying website:', error);
      setDeployError('Failed to deploy website. Please try again later.');
    } finally {
      setDeploying(false);
    }
  };

  const handleDeleteDeployment = async (deploymentId: string) => {
    if (window.confirm('Are you sure you want to delete this deployment?')) {
      try {
        // In a real app, this would call the API
        // For now, we'll just update the state
        setDeployments(deployments.filter(d => d.id !== deploymentId));
      } catch (error) {
        console.error('Error deleting deployment:', error);
      }
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'deployed':
        return <Chip icon={<CheckCircleIcon />} label="Deployed" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'failed':
        return <Chip icon={<ErrorIcon />} label="Failed" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getEnvironmentChip = (env: string) => {
    return env === 'production' 
      ? <Chip label="Production" color="primary" size="small" />
      : <Chip label="Development" color="default" size="small" />;
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Deployments</Typography>
          <Box>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchDeployments} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton onClick={() => setShowSettings(true)} sx={{ mr: 1 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setShowDeployDialog(true)}
            >
              Deploy Website
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : deployments.length === 0 ? (
          <Alert severity="info">
            No deployments found. Click "Deploy Website" to create one.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {deployments.map((deployment) => (
              <Grid item xs={12} md={6} lg={4} key={deployment.id}>
                <Card>
                  <Box sx={{ position: 'relative' }}>
                    {deployment.thumbnail ? (
                      <Box
                        component="img"
                        src={deployment.thumbnail}
                        alt={deployment.metadata.title}
                        sx={{
                          width: '100%',
                          height: 140,
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: 140,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          No Preview
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {getStatusChip(deployment.status)}
                      {getEnvironmentChip(deployment.environment)}
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {deployment.metadata.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {deployment.metadata.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Template: {deployment.metadata.template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subdomain: {deployment.subdomain}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      href={deployment.url}
                      target="_blank"
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteDeployment(deployment.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Deploy Dialog */}
      <Dialog open={showDeployDialog} onClose={() => !deploying && setShowDeployDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deploy Website</DialogTitle>
        <DialogContent>
          {deployError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deployError}
            </Alert>
          )}
          
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              SelectProps={{
                native: true,
              }}
              sx={{ mb: 2 }}
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              label="Subdomain"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="e.g., acme"
              helperText="This will be used for the URL: subdomain.localhost:3001"
              sx={{ mb: 2 }}
            />
            
            <TextField
              select
              fullWidth
              label="Environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as 'development' | 'production')}
              SelectProps={{
                native: true,
              }}
            >
              <option value="development">Development</option>
              <option value="production">Production</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeployDialog(false)} disabled={deploying}>
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            variant="contained"
            disabled={deploying || !selectedTemplate || !subdomain}
          >
            {deploying ? <CircularProgress size={24} /> : 'Deploy'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deployment Settings</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Default Environment"
                secondary="Choose the default environment for new deployments"
              />
              <ListItemSecondaryAction>
                <TextField
                  select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as 'development' | 'production')}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </TextField>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 