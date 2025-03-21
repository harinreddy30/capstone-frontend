import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayrollById, reviewAndFinalizePayroll } from '../redux/actions/payrollActions';
import { Button, Typography } from '@mui/material';

const ReviewPayrollPage = ({ payrollId }) => {
  const dispatch = useDispatch();
  const { payroll, loading, error } = useSelector((state) => state.payroll);
  const [finalized, setFinalized] = useState(false);

  useEffect(() => {
    dispatch(getPayrollById(payrollId));
  }, [dispatch, payrollId]);

  const handleReview = () => {
    dispatch(reviewAndFinalizePayroll(payrollId));
    setFinalized(true);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {payroll && (
        <div>
          <Typography variant="h4">Payroll Details</Typography>
          <Typography>User: {payroll.userId.fname} {payroll.userId.lname}</Typography>
          <Typography>Gross Pay: {payroll.grossPay}</Typography>
          <Typography>Net Pay: {payroll.netPay}</Typography>
          <Typography>Status: {payroll.status}</Typography>
          <Typography>Pay Period: {payroll.payPeriod.start} - {payroll.payPeriod.end}</Typography>
          <Button onClick={handleReview} variant="contained" disabled={finalized}>
            {finalized ? 'Payroll Finalized' : 'Finalize Payroll'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewPayrollPage;
