import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Code as CodeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Lead } from '../lib/types';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onGenerateWebsite: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  selectedLeads: number[];
  onSelectLead: (leadId: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export default function LeadsTable({
  leads,
  loading,
  onEdit,
  onGenerateWebsite,
  onSendEmail,
  onDelete,
  selectedLeads,
  onSelectLead,
  onSelectAll
}: LeadsTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(event.target.checked);
  };

  const handleSelectLead = (leadId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectLead(leadId, event.target.checked);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Enrichment':
        return 'warning';
      case 'Ready for Website Gen':
        return 'info';
      case 'Website Generated':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (leads.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="body1" color="textSecondary">
          No leads found. Add a new lead or adjust your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedLeads.length > 0 && selectedLeads.length < leads.length}
                checked={leads.length > 0 && selectedLeads.length === leads.length}
                onChange={handleSelectAll}
                inputProps={{ 'aria-label': 'select all leads' }}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => {
            const isSelected = selectedLeads.includes(lead.id);
            const isHovered = hoveredRow === lead.id;

            return (
              <TableRow
                hover
                key={lead.id}
                selected={isSelected}
                onMouseEnter={() => setHoveredRow(lead.id)}
                onMouseLeave={() => setHoveredRow(null)}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={handleSelectLead(lead.id)}
                    inputProps={{ 'aria-label': `select lead ${lead.name}` }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {lead.name}
                </TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone || '-'}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>{lead.industry || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.status}
                    color={getStatusColor(lead.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(lead)}
                        sx={{ opacity: isHovered ? 1 : 0.7 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate Website">
                      <IconButton
                        size="small"
                        onClick={() => onGenerateWebsite(lead)}
                        sx={{ opacity: isHovered ? 1 : 0.7 }}
                      >
                        <CodeIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton
                        size="small"
                        onClick={() => onSendEmail(lead)}
                        sx={{ opacity: isHovered ? 1 : 0.7 }}
                      >
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(lead)}
                        sx={{ opacity: isHovered ? 1 : 0.7 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 