import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { LLMService, LLMConfig, LLMModel } from '../../lib/services/llm-service';

export default function LLMSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<LLMModel[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [settings, setSettings] = useState<{
    openrouter: LLMConfig;
    google: LLMConfig;
  }>({
    openrouter: {
      provider: 'openrouter',
      model: 'anthropic/claude-3-opus',
      apiKey: '',
      maxTokens: 2000,
      temperature: 0.7,
      siteUrl: '',
      siteName: '',
    },
    google: {
      provider: 'google',
      model: 'gemini-pro',
      apiKey: '',
      maxTokens: 2000,
      temperature: 0.7,
    },
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('llm_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  const handleFetchModels = async (provider: 'openrouter' | 'google') => {
    try {
      setLoading(true);
      const service = new LLMService(settings[provider]);
      const modelList = await service.listModels();
      setModels(modelList);
      setStatus({ type: 'success', message: 'Models fetched successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to fetch models. Please check your API key.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('llm_settings', JSON.stringify(settings));
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save settings' });
    }
  };

  const handleTestConnection = async (provider: 'openrouter' | 'google') => {
    try {
      setLoading(true);
      const service = new LLMService(settings[provider]);
      const isValid = await service.validateApiKey();
      if (isValid) {
        setStatus({ type: 'success', message: 'Connection test successful!' });
      } else {
        setStatus({ type: 'error', message: 'Invalid API key' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Connection test failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Link href="/leads" passHref>
            <IconButton sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h4" component="h1">
            LLM Settings
          </Typography>
        </Box>
        <Typography color="textSecondary">
          Configure your LLM integration for generating website content
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label="General Settings" value="general" />
          <Tab label="Available Models" value="models" />
        </Tabs>
      </Box>

      {status && (
        <Alert severity={status.type} sx={{ mb: 3 }} onClose={() => setStatus(null)}>
          {status.message}
        </Alert>
      )}

      {activeTab === 'general' && (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                OpenRouter Configuration
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Connect to OpenRouter to use various LLM models for generating website content
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="OpenRouter API Key"
                  value={settings.openrouter.apiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    openrouter: { ...settings.openrouter, apiKey: e.target.value }
                  })}
                  type={showApiKey ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    <Link href="https://openrouter.ai/keys" target="_blank" style={{ color: 'inherit' }}>
                      Get your API key from OpenRouter
                    </Link>
                  }
                />
              </FormControl>

              <TextField
                fullWidth
                label="Site URL (Optional)"
                value={settings.openrouter.siteUrl}
                onChange={(e) => setSettings({
                  ...settings,
                  openrouter: { ...settings.openrouter, siteUrl: e.target.value }
                })}
                sx={{ mb: 3 }}
                helperText="Used for attribution in OpenRouter's analytics and rankings"
              />

              <TextField
                fullWidth
                label="Site Name (Optional)"
                value={settings.openrouter.siteName}
                onChange={(e) => setSettings({
                  ...settings,
                  openrouter: { ...settings.openrouter, siteName: e.target.value }
                })}
                helperText="Used for rankings on OpenRouter"
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Google AI Configuration
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Configure Google's Gemini API for content generation
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label="Google AI API Key"
                  value={settings.google.apiKey}
                  onChange={(e) => setSettings({
                    ...settings,
                    google: { ...settings.google, apiKey: e.target.value }
                  })}
                  type={showApiKey ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={
                    <Link href="https://makersuite.google.com/app/apikey" target="_blank" style={{ color: 'inherit' }}>
                      Get your API key from Google AI Studio
                    </Link>
                  }
                />
              </FormControl>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleTestConnection('openrouter')}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Test OpenRouter Connection'}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleTestConnection('google')}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Test Google Connection'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </>
      )}

      {activeTab === 'models' && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleFetchModels('openrouter')}
              disabled={loading}
            >
              Fetch OpenRouter Models
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFetchModels('google')}
              disabled={loading}
            >
              Fetch Google Models
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {models.map((model) => (
                <ListItem key={model.id}>
                  <ListItemText
                    primary={model.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          Context Length: {model.contextLength} tokens
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="textSecondary">
                          Pricing: ${model.pricing.prompt}/1K prompt tokens, ${model.pricing.completion}/1K completion tokens
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip label={model.provider} color="primary" />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Container>
  );
} 