import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useApi } from '../../lib/api-context';
import { WebsiteTemplate } from '../../lib/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function WebsiteTemplates() {
  const api = useApi();
  const [templates, setTemplates] = useState<WebsiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate | null>(null);
  const [formData, setFormData] = useState<Partial<WebsiteTemplate>>({
    name: '',
    description: '',
    html: '',
    css: '',
    thumbnail: 'https://via.placeholder.com/300x200',
    category: 'business',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWebsiteTemplates();
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load website templates');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddTemplate = () => {
    setFormData({
      name: '',
      description: '',
      html: '',
      css: '',
      thumbnail: 'https://via.placeholder.com/300x200',
      category: 'business',
    });
    setShowAddModal(true);
  };

  const handleEditTemplate = (template: WebsiteTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      html: template.html,
      css: template.css,
      thumbnail: template.thumbnail,
      category: template.category,
    });
    setShowEditModal(true);
  };

  const handlePreviewTemplate = (template: WebsiteTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleDeleteTemplate = async (template: WebsiteTemplate) => {
    if (window.confirm(`Are you sure you want to delete ${template.name}?`)) {
      try {
        await api.deleteWebsiteTemplate(template.id);
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        setError('Failed to delete template');
      }
    }
  };

  const handleFormChange = (field: keyof WebsiteTemplate, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveTemplate = async () => {
    if (!formData.name || !formData.html) {
      setFormError('Name and HTML are required');
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (showEditModal && selectedTemplate) {
        await api.updateWebsiteTemplate(selectedTemplate.id, formData as WebsiteTemplate);
      } else {
        await api.createWebsiteTemplate(formData as WebsiteTemplate);
      }

      fetchTemplates();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving template:', error);
      setFormError('Failed to save template');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    if (tabValue === 0) return true; // All templates
    if (tabValue === 1) return template.category === 'business';
    if (tabValue === 2) return template.category === 'portfolio';
    if (tabValue === 3) return template.category === 'ecommerce';
    return true;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Website Templates</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTemplate}
        >
          Add Template
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="template tabs">
          <Tab label="All Templates" />
          <Tab label="Business" />
          <Tab label="Portfolio" />
          <Tab label="E-commerce" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : filteredTemplates.length === 0 ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No templates found
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddTemplate}
                sx={{ mt: 2 }}
              >
                Create your first template
              </Button>
            </Grid>
          ) : (
            filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.thumbnail}
                    alt={template.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Category: {template.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handlePreviewTemplate(template)}>
                      <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTemplate(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : filteredTemplates.length === 0 ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No business templates found
              </Typography>
            </Grid>
          ) : (
            filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.thumbnail}
                    alt={template.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handlePreviewTemplate(template)}>
                      <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTemplate(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : filteredTemplates.length === 0 ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No portfolio templates found
              </Typography>
            </Grid>
          ) : (
            filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.thumbnail}
                    alt={template.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handlePreviewTemplate(template)}>
                      <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTemplate(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Grid>
          ) : filteredTemplates.length === 0 ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No e-commerce templates found
              </Typography>
            </Grid>
          ) : (
            filteredTemplates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={template.thumbnail}
                    alt={template.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handlePreviewTemplate(template)}>
                      <PreviewIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditTemplate(template)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTemplate(template)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </TabPanel>

      {/* Add/Edit Template Modal */}
      <Dialog
        open={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {showAddModal ? 'Add New Template' : 'Edit Template'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Template Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  label="Category"
                >
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="portfolio">Portfolio</MenuItem>
                  <MenuItem value="ecommerce">E-commerce</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Thumbnail URL"
                value={formData.thumbnail}
                onChange={(e) => handleFormChange('thumbnail', e.target.value)}
                helperText="URL to the template thumbnail image"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="HTML"
                value={formData.html}
                onChange={(e) => handleFormChange('html', e.target.value)}
                multiline
                rows={6}
                required
                helperText="HTML structure of the template"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CSS"
                value={formData.css}
                onChange={(e) => handleFormChange('css', e.target.value)}
                multiline
                rows={6}
                helperText="CSS styles for the template"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTemplate}
            variant="contained"
            color="primary"
            disabled={formLoading}
          >
            {formLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Template Modal */}
      <Dialog
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Preview: {selectedTemplate?.name}</DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedTemplate.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                HTML Preview
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  maxHeight: '300px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                <pre>{selectedTemplate.html}</pre>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                CSS Preview
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  maxHeight: '300px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                <pre>{selectedTemplate.css}</pre>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreviewModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 