import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayrolls, deletePayroll, finalizePayroll } from '../../redux/action/payrollAction';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payrolls, loading, error } = useSelector((state) => state.payroll);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [payrollToDelete, setPayrollToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPayrolls());
  }, [dispatch]);

  const handleReview = (payroll) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPayroll(null);
    setShowModal(false);
  };

  const handleFinalize = async (payrollId) => {
    try {
      if (!selectedPayroll || !selectedPayroll.userId || !selectedPayroll.userId._id) {
        throw new Error("User data is incomplete.");
      }

      const userId = selectedPayroll.userId._id;
      await dispatch(finalizePayroll(payrollId, userId));
      await dispatch(fetchAllPayrolls());
      closeModal();
    } catch (err) {
      console.error("Error finalizing payroll:", err);
    }
  };

  const handleDelete = (payrollId) => {
    setPayrollToDelete(payrollId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (payrollToDelete) {
      dispatch(deletePayroll(payrollToDelete));
      setOpenDeleteDialog(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'generated':
        return 'info';
      case 'finalized':
        return 'success';
      default:
        return 'default';
    }
  };

  const filteredPayrolls = payrolls
    .filter(payroll => filterStatus === 'all' || payroll.status?.toLowerCase() === filterStatus)
    .filter(payroll => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${payroll.userId?.fname} ${payroll.userId?.lname}`.toLowerCase();
      return searchTerm === '' || fullName.includes(searchLower);
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} bgcolor="error.light" borderRadius={1} color="error.dark">
        <Typography variant="h6">Error</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Payroll Dashboard
        </Typography>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by Employee Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: <FilterListIcon color="action" sx={{ mr: 1 }} />
          }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="generated">Generated</MenuItem>
          <MenuItem value="finalized">Finalized</MenuItem>
        </TextField>
      </Box>

      {filteredPayrolls.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No payroll records found
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Gross Pay</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Net Pay</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Pay Period</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Hourly Rate</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayrolls.map((payroll) => (
                <TableRow 
                  key={payroll._id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>
                    {payroll.userId ? 
                      `${payroll.userId.fname} ${payroll.userId.lname}` : 
                      'No User Found'
                    }
                  </TableCell>
                  <TableCell>
                    ${payroll.grossPay?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${payroll.netPay?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payroll.status || 'N/A'} 
                      color={getStatusColor(payroll.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(payroll.payPeriod?.start).toLocaleDateString()} - 
                    {new Date(payroll.payPeriod?.end).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${payroll.hourlyRate?.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        onClick={() => handleReview(payroll)}
                        color="primary"
                        size="small"
                        title="Review"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(payroll._id)}
                        color="error"
                        size="small"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Review Modal */}
      {showModal && selectedPayroll && (
        <Dialog 
          open={showModal} 
          onClose={closeModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Review Payment</Typography>
              <IconButton onClick={closeModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} my={2}>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Employee</Typography>
                <Typography variant="body1">
                  {selectedPayroll.userId.fname} {selectedPayroll.userId.lname}
                </Typography>
              </Box>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Pay Period</Typography>
                <Typography variant="body1">
                  {new Date(selectedPayroll.payPeriod.start).toLocaleDateString()} -{" "}
                  {new Date(selectedPayroll.payPeriod.end).toLocaleDateString()}
                </Typography>
              </Box>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Hours Worked</Typography>
                <Typography variant="body1">{selectedPayroll.hoursWorked}</Typography>
              </Box>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Gross Pay</Typography>
                <Typography variant="body1">${Number(selectedPayroll.grossPay).toFixed(2)}</Typography>
              </Box>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Overtime Hours</Typography>
                <Typography variant="body1">{selectedPayroll.overtimeHours || 0}</Typography>
              </Box>
              <Box bgcolor="grey.100" p={2} borderRadius={1}>
                <Typography variant="subtitle2" color="text.secondary">Net Pay</Typography>
                <Typography variant="body1">${Number(selectedPayroll.netPay).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Box bgcolor="grey.100" p={2} borderRadius={1} mt={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Deductions</Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <div>
                  <Typography variant="body2">
                    Taxes: ${selectedPayroll.deductions?.taxes?.toFixed(2) || "0.00"}
                  </Typography>
                  <Typography variant="body2">
                    CPP: ${selectedPayroll.deductions?.CPP?.toFixed(2) || "0.00"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2">
                    EI: ${selectedPayroll.deductions?.EI?.toFixed(2) || "0.00"}
                  </Typography>
                  <Typography variant="body2">
                    Other: ${selectedPayroll.deductions?.otherDeductions?.toFixed(2) || "0.00"}
                  </Typography>
                </div>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="inherit">
              Close
            </Button>
            {selectedPayroll.status !== "Finalized" && (
              <Button 
                onClick={() => handleFinalize(selectedPayroll._id)}
                variant="contained" 
                color="primary"
              >
                Finalize
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payroll record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
