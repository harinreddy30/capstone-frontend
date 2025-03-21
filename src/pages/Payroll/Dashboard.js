import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayrolls, deletePayroll } from '../../redux/action/payrollAction';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // for navigation

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Using useNavigate for navigation
  const { payrolls, loading, error } = useSelector((state) => state.payroll);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [payrollToDelete, setPayrollToDelete] = React.useState(null);

  useEffect(() => {
    dispatch(fetchAllPayrolls());
  }, [dispatch]);

  const handleReview = (payrollId) => {
    // Navigate to the review page
    navigate(`/payroll/review/${payrollId}`); // Replace with your actual review route
  };

  const handleDelete = (payrollId) => {
    // Open the confirmation dialog to delete the payroll
    setPayrollToDelete(payrollId);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (payrollToDelete) {
      dispatch(deletePayroll(payrollToDelete)); // Assuming you have a deletePayroll action
      setOpenDeleteDialog(false); // Close the dialog after deleting
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false); // Close the dialog if user cancels
  };

  return (
    <div>
      <h1>Payroll Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pay Period</TableCell>
              <TableCell>Hourly Wage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll._id}>
                <TableCell>
                  {payroll.userId ? `${payroll.userId.fname} ${payroll.userId.lname}` : 'No User Found'}
                </TableCell>
                <TableCell>{payroll.grossPay}</TableCell>
                <TableCell>{payroll.netPay}</TableCell>
                <TableCell>{payroll.status}</TableCell>
                <TableCell>{`${payroll.payPeriod.start} - ${payroll.payPeriod.end}`}</TableCell>
                <TableCell>{payroll.hourlyRate}</TableCell>

                <TableCell>
                  <Button onClick={() => handleReview(payroll._id)}>Review</Button>
                  <Button onClick={() => handleDelete(payroll._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this payroll record?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
