// src/components/Reactor/ReactorCard.jsx

import React from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Science as ScienceIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { formatRelativeTime } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';

const ReactorCard = ({ reactor, onClick, onEdit, onDelete }) => {
  const { user } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    handleMenuClose(event);
    if (onEdit) onEdit(reactor);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    handleMenuClose(event);
    if (onDelete) onDelete(reactor);
  };

  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <ScienceIcon color="primary" sx={{ fontSize: 40 }} />
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={reactor.is_active ? 'Active' : 'Inactive'}
                color={reactor.is_active ? 'success' : 'default'}
                size="small"
              />
              {user?.role === 'admin' && (onEdit || onDelete) && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {reactor.reactor_name}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Location: {reactor.location || 'Not specified'}
          </Typography>

          {reactor.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {reactor.description}
            </Typography>
          )}

          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">
              Created {formatRelativeTime(reactor.created_at)}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDelete}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default ReactorCard;