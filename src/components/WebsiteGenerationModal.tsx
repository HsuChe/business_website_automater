import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Preview as PreviewIcon, Code as CodeIcon } from '@mui/icons-material';
import { Lead, WebsiteTemplate } from '../lib/types';
import { useApi } from '../lib/api-context';
import { LLMService } from '../lib/services/llm-service';
import { getLLMConfig, validateLLMConfig } from '../lib/config/llm-config';

interface WebsiteGenerationModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead;
  onSuccess: (deployment: any) => void;
}

export default function WebsiteGenerationModal({
  open,
  onClose,
  lead,
  onSuccess,
}: WebsiteGenerationModalProps) {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [environment, setEnvironment] = useState<'development' | 'production'>('development');
  const [llmProvider, setLLMProvider] = useState('openai');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (open) {
      fetchTemplates();
      // Generate a default subdomain from the company name
      const defaultSubdomain = lead.company
        ? lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')
        : '';
      setSubdomain(defaultSubdomain);
    }
  }, [open, lead]);

  const fetchTemplates = async () => {
    try {
      const data = await api.getWebsiteTemplates();
      setTemplates(data || []);
      if (data && data.length > 0) {
        setSelectedTemplate(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load website templates');
    }
  };

  const generateContent = async () => {
    if (!selectedTemplate) {
      setError('Please select a template first');
      return;
    }

    try {
      setContentLoading(true);
      setError(null);

      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error('Selected template not found');
      }

      const config = getLLMConfig(llmProvider);
      if (!validateLLMConfig(config)) {
        throw new Error(`Invalid configuration for provider: ${llmProvider}`);
      }

      const llmService = new LLMService(config);
      const response = await llmService.generateWebsiteContent(lead, template);

      if (response.error) {
        throw new Error(response.error);
      }

      try {
        const content = JSON.parse(response.text);
        setGeneratedContent(content);
      } catch (error) {
        throw new Error('Failed to parse LLM response as JSON');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setContentLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !lead) {
      setError('Please select a template');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate website
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          leadId: lead.id,
          llmProvider,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate website');
      }

      const { deployment } = await response.json();

      // Update lead status
      await api.updateLead(lead.id, {
        status: 'website_generated',
        metadata: {
          ...lead.metadata,
          deploymentId: deployment.id,
        },
      });

      onSuccess?.(deployment);
      onClose();
    } catch (error) {
      console.error('Error generating website:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedTemplate || !lead) {
      setError('Please select a template');
      return;
    }

    try {
      setPreviewLoading(true);
      setError(null);

      // Generate preview
      const response = await fetch('/api/preview-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          leadId: lead.id,
          llmProvider,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate preview');
      }

      const { html } = await response.json();
      setPreviewHtml(html);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Generate Website for {lead.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Website Template</InputLabel>
                <Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  label="Website Template"
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Subdomain"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                sx={{ mb: 2 }}
                helperText="This will be used in the URL: yourdomain.com"
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Environment</InputLabel>
                <Select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value as 'development' | 'production')}
                  label="Environment"
                >
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="production">Production</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Content Generation</InputLabel>
                <RadioGroup
                  value={llmProvider}
                  onChange={(e) => setLLMProvider(e.target.value)}
                >
                  <FormControlLabel value="openai" control={<Radio />} label="OpenAI GPT-4" />
                  <FormControlLabel value="openrouter" control={<Radio />} label="OpenRouter Claude" />
                  <FormControlLabel value="google" control={<Radio />} label="Google Gemini" />
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={generateContent}
                disabled={contentLoading || !selectedTemplate}
                fullWidth
                sx={{ mb: 2 }}
              >
                {contentLoading ? <CircularProgress size={24} /> : 'Generate Content'}
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedTemplate && (
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={templates.find(t => t.id === selectedTemplate)?.thumbnail || 'https://via.placeholder.com/300x200'}
                    alt="Template preview"
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {templates.find(t => t.id === selectedTemplate)?.description}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {generatedContent && (
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Generated Content
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {generatedContent.headline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {generatedContent.subheadline}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {generatedContent.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Services:
                    </Typography>
                    {generatedContent.services.map((service: any, index: number) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {service.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.description}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handlePreview}
          disabled={loading || previewLoading || !selectedTemplate}
          startIcon={previewLoading ? <CircularProgress size={20} /> : <PreviewIcon />}
        >
          Preview
        </Button>
        <Button
          onClick={handleGenerate}
          variant="contained"
          color="primary"
          disabled={loading || previewLoading || !selectedTemplate}
          startIcon={loading ? <CircularProgress size={20} /> : <CodeIcon />}
        >
          Generate Website
        </Button>
      </DialogActions>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Website Preview</DialogTitle>
        <DialogContent>
          {previewHtml && (
            <iframe
              srcDoc={previewHtml}
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
} 