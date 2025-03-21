import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayrollForUser } from '../redux/actions/payrollActions';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ViewPayrollPage = () => {
  const dispatch = useDispatch();
  const { payrolls, loading, error } = useSelector((state) => state.payroll);

  useEffect(() => {
    dispatch(fetchPayrollForUser());
  }, [dispatch]);

  return (
    <div>
      <h1>My Payroll History</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gross Pay</TableCell>
              <TableCell>Net Pay</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pay Period</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll._id}>
                <TableCell>{payroll.grossPay}</TableCell>
                <TableCell>{payroll.netPay}</TableCell>
                <TableCell>{payroll.status}</TableCell>
                <TableCell>{`${payroll.payPeriod.start} - ${payroll.payPeriod.end}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewPayrollPage;
