import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Paper,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material';

interface LeadsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  industryFilter: string[];
  onIndustryFilterChange: (value: string[]) => void;
  statusFilter: string[];
  onStatusFilterChange: (value: string[]) => void;
  industries: string[];
  statuses: string[];
  onResetFilters: () => void;
}

export default function LeadsFilters({
  searchTerm,
  onSearchChange,
  industryFilter,
  onIndustryFilterChange,
  statusFilter,
  onStatusFilterChange,
  industries,
  statuses,
  onResetFilters,
}: LeadsFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleIndustryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onIndustryFilterChange(event.target.value as string[]);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onStatusFilterChange(event.target.value as string[]);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'background.paper' }}>
      <Grid container spacing={3}>
        {/* Search Field */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Grid>

        {/* Industry Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Industry</InputLabel>
            <Select
              multiple
              value={industryFilter}
              onChange={handleIndustryChange}
              input={<OutlinedInput label="Industry" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={statusFilter}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onResetFilters}
              startIcon={<ClearIcon />}
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
} 