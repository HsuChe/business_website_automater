import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  Alert
} from '@mui/material';
import { WebsiteTemplate, EmailTemplate } from '../lib/types';

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
        <Box sx={{ p: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface TemplateSelectionModalProps {
  open: boolean;
  onClose: () => void;
  websiteTemplates: WebsiteTemplate[];
  emailTemplates: EmailTemplate[];
  selectedWebsiteTemplates: number[];
  selectedEmailTemplates: number[];
  onWebsiteTemplateSelect: (templateId: number, selected: boolean) => void;
  onEmailTemplateSelect: (templateId: number, selected: boolean) => void;
  onApplyTemplates: () => void;
}

export default function TemplateSelectionModal({
  open,
  onClose,
  websiteTemplates,
  emailTemplates,
  selectedWebsiteTemplates,
  selectedEmailTemplates,
  onWebsiteTemplateSelect,
  onEmailTemplateSelect,
  onApplyTemplates
}: TemplateSelectionModalProps) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleWebsiteTemplateToggle = (templateId: number) => () => {
    const selected = selectedWebsiteTemplates.includes(templateId);
    onWebsiteTemplateSelect(templateId, !selected);
  };

  const handleEmailTemplateToggle = (templateId: number) => () => {
    const selected = selectedEmailTemplates.includes(templateId);
    onEmailTemplateSelect(templateId, !selected);
  };

  const handleApplyTemplates = () => {
    onApplyTemplates();
    onClose();
  };

  const filteredWebsiteTemplates = websiteTemplates.filter(template => 
    template.testStatus === 'passed' || template.testStatus === undefined
  );

  const filteredEmailTemplates = emailTemplates.filter(template => 
    template.testStatus === 'passed' || template.testStatus === undefined
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Templates</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="template tabs">
            <Tab label="Website Templates" id="template-tab-0" />
            <Tab label="Email Templates" id="template-tab-1" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {filteredWebsiteTemplates.length === 0 ? (
            <Alert severity="info">
              No website templates available. Please create and test templates first.
            </Alert>
          ) : (
            <List>
              {filteredWebsiteTemplates.map((template) => (
                <React.Fragment key={template.id}>
                  <ListItem>
                    <ListItemText
                      primary={template.name}
                      secondary={template.description}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={selectedWebsiteTemplates.includes(template.id)}
                        onChange={handleWebsiteTemplateToggle(template.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {filteredEmailTemplates.length === 0 ? (
            <Alert severity="info">
              No email templates available. Please create and test templates first.
            </Alert>
          ) : (
            <List>
              {filteredEmailTemplates.map((template) => (
                <React.Fragment key={template.id}>
                  <ListItem>
                    <ListItemText
                      primary={template.name}
                      secondary={`Subject: ${template.subject}`}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={selectedEmailTemplates.includes(template.id)}
                        onChange={handleEmailTemplateToggle(template.id)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleApplyTemplates} 
          variant="contained" 
          color="primary"
          disabled={selectedWebsiteTemplates.length === 0 && selectedEmailTemplates.length === 0}
        >
          Apply Templates
        </Button>
      </DialogActions>
    </Dialog>
  );
} 