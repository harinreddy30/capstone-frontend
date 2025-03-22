import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPayrolls } from '../../redux/action/payrollAction';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';

function PayStub() {
  const dispatch = useDispatch();
  const { payrolls = [], loading = false, error = null } = useSelector((state) => state.payroll || {});
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({ start: '', end: '' });
  const [currentPayroll, setCurrentPayroll] = useState(null);

  // Fetch payrolls when component mounts
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        await dispatch(fetchUserPayrolls());
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      }
    };

    fetchPayrolls();
  }, [dispatch]);

  // Update filtered payrolls when payrolls change
  useEffect(() => {
    setFilteredPayrolls(payrolls);
  }, [payrolls]);

  const handlePeriodChange = (e) => {
    const { name, value } = e.target;
    setSelectedPeriod(prev => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    if (!selectedPeriod.start || !selectedPeriod.end) {
      alert('Please select a valid date range.');
      return;
    }

    const startDate = new Date(selectedPeriod.start);
    const endDate = new Date(selectedPeriod.end);

    const filtered = payrolls.filter((payroll) => {
      const payrollStartDate = new Date(payroll.payPeriod.start);
      const payrollEndDate = new Date(payroll.payPeriod.end);

      return payrollStartDate >= startDate && payrollEndDate <= endDate;
    });

    setFilteredPayrolls(filtered);
  };

  const handleViewPayroll = (payroll) => {
    setCurrentPayroll(currentPayroll?._id === payroll._id ? null : payroll);
  };

  const handleDownload = () => {
    if (!currentPayroll) return;

    console.log('Current Payroll Data:', currentPayroll);
    console.log('User Data in Payroll:', currentPayroll.userId);

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Company Header
    doc.setFontSize(20);
    doc.text('SHIFT SMART', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('123 Business Street', pageWidth / 2, 30, { align: 'center' });
    doc.text('Toronto, Ontario, M1G 1G1', pageWidth / 2, 35, { align: 'center' });
    
    // Add horizontal line under header
    doc.line(20, 40, 190, 40);
    
    // Payroll Period
    doc.setFontSize(16);
    doc.text('PAY STUB', pageWidth / 2, 50, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Pay Period: ${new Date(currentPayroll.payPeriod.start).toLocaleDateString()} - ${new Date(currentPayroll.payPeriod.end).toLocaleDateString()}`, 20, 65);
    
    // Employee Information
    doc.text('Employee Information:', 20, 80);
    const employee = currentPayroll.userId || {};
    doc.text(`Name: ${employee.fname || ''} ${employee.lname || ''}`, 30, 90);
    doc.text(`Employee ID: ${employee.employeeId || 'N/A'}`, 30, 100);
    doc.text(`Role: ${employee.role || 'Employee'}`, 30, 110);
    doc.text(`Email: ${employee.email || ''}`, 30, 120);
    
    // Add line under employee information
    doc.line(20, 125, 190, 125);
    
    // Hours and Rate Information
    doc.text('Hours and Rate Information:', 20, 140);
    doc.text(`Hourly Rate: $${Number(currentPayroll.hourlyRate).toFixed(2)}`, 30, 150);
    doc.text(`Regular Hours: ${currentPayroll.hoursWorked}`, 30, 160);
    
    let currentY = 160;
    if (currentPayroll.overtimeHours > 0) {
        currentY += 10;
        doc.text(`Overtime Hours: ${currentPayroll.overtimeHours}`, 30, currentY);
        doc.text(`Overtime Rate: $${Number(currentPayroll.overtimeRate).toFixed(2)}`, 30, currentY + 10);
        currentY += 10;
    }
    
    // Add line under hours information
    doc.line(20, currentY + 15, 190, currentY + 15);
    
    // Earnings Section
    currentY += 30;
    doc.text('Earnings:', 20, currentY);
    // Create a table-like structure for earnings
    doc.text('Description', 30, currentY + 10);
    doc.text('Hours', 100, currentY + 10);
    doc.text('Amount', 150, currentY + 10);
    doc.line(20, currentY + 13, 190, currentY + 13);

    // Regular Pay
    currentY += 20;
    doc.text('Regular Pay', 30, currentY);
    doc.text(`${currentPayroll.hoursWorked}`, 100, currentY);
    const regularPay = currentPayroll.hoursWorked * currentPayroll.hourlyRate;
    doc.text(`$${regularPay.toFixed(2)}`, 150, currentY);

    // Overtime Pay if exists
    if (currentPayroll.overtimeHours > 0) {
        currentY += 10;
        doc.text('Overtime Pay', 30, currentY);
        doc.text(`${currentPayroll.overtimeHours}`, 100, currentY);
        const overtimePay = currentPayroll.overtimeHours * currentPayroll.overtimeRate;
        doc.text(`$${overtimePay.toFixed(2)}`, 150, currentY);
    }
    
    // Add line under earnings
    doc.line(20, currentY + 5, 190, currentY + 5);
    
    // Deductions Section
    currentY += 20;
    doc.text('Deductions:', 20, currentY);
    doc.text('Description', 30, currentY + 10);
    doc.text('Amount', 150, currentY + 10);
    doc.line(20, currentY + 13, 190, currentY + 13);
    
    currentY += 25;
    if (currentPayroll.deductions) {
        if (currentPayroll.deductions.taxes) {
            doc.text('Taxes', 30, currentY);
            doc.text(`$${Number(currentPayroll.deductions.taxes).toFixed(2)}`, 150, currentY);
            currentY += 10;
        }
        if (currentPayroll.deductions.CPP) {
            doc.text('CPP', 30, currentY);
            doc.text(`$${Number(currentPayroll.deductions.CPP).toFixed(2)}`, 150, currentY);
            currentY += 10;
        }
        if (currentPayroll.deductions.EI) {
            doc.text('EI', 30, currentY);
            doc.text(`$${Number(currentPayroll.deductions.EI).toFixed(2)}`, 150, currentY);
            currentY += 10;
        }
        if (currentPayroll.deductions.otherDeductions) {
            doc.text('Other Deductions', 30, currentY);
            doc.text(`$${Number(currentPayroll.deductions.otherDeductions).toFixed(2)}`, 150, currentY);
            currentY += 10;
        }
    }
    
    // Summary Section
    doc.line(20, currentY + 5, 190, currentY + 5);
    currentY += 20;
    doc.setFont(undefined, 'bold');
    doc.text('Summary:', 20, currentY);
    currentY += 10;
    
    // Calculate total deductions
    const totalDeductions = Object.values(currentPayroll.deductions || {})
        .reduce((sum, val) => sum + (Number(val) || 0), 0);
    
    // Display summary
    doc.text('Gross Pay:', 30, currentY);
    doc.text(`$${Number(currentPayroll.grossPay).toFixed(2)}`, 150, currentY);
    currentY += 10;
    doc.text('Total Deductions:', 30, currentY);
    doc.text(`$${totalDeductions.toFixed(2)}`, 150, currentY);
    currentY += 10;
    doc.text('Net Pay:', 30, currentY);
    doc.text(`$${Number(currentPayroll.netPay).toFixed(2)}`, 150, currentY);
    
    // Footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.line(20, 270, 190, 270);
    const today = new Date().toLocaleDateString();
    doc.text(`Generated on: ${today}`, 20, 280);
    doc.text('SHIFT SMART Inc.', pageWidth / 2, 285, { align: 'center' });
    doc.text('This is an official pay stub document', pageWidth / 2, 280, { align: 'center' });

    // Save the PDF
    const fileName = `PayStub_${employee.fname || 'Employee'}_${new Date(currentPayroll.payPeriod.start).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const renderContent = () => {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Payroll History
          </Typography>

          {/* Date Filter */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              type="date"
              label="From"
              name="start"
              value={selectedPeriod.start}
              onChange={handlePeriodChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              type="date"
              label="To"
              name="end"
              value={selectedPeriod.end}
              onChange={handlePeriodChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleFilter}
              size="small"
            >
              Filter
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          ) : (
            <>
              {filteredPayrolls.length === 0 ? (
                <Typography color="text.secondary">
                  No payrolls found for the selected period.
                </Typography>
              ) : (
                <List>
                  {filteredPayrolls.map((payroll, index) => (
                    <React.Fragment key={payroll._id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography>
                              Pay Period: {new Date(payroll.payPeriod.start).toLocaleDateString()} - {new Date(payroll.payPeriod.end).toLocaleDateString()}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              component="span"
                              sx={{
                                color: payroll.status === 'Finalized' ? 'success.main' : 'warning.main',
                                fontSize: '0.875rem'
                              }}
                            >
                              {payroll.status}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewPayroll(payroll)}
                          >
                            {currentPayroll?._id === payroll._id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>

                      {currentPayroll?._id === payroll._id && (
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5', mb: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Gross Pay
                              </Typography>
                              <Typography variant="body1">
                                ${Number(currentPayroll.grossPay).toFixed(2)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Net Pay
                              </Typography>
                              <Typography variant="body1">
                                ${Number(currentPayroll.netPay).toFixed(2)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Deductions
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2">
                                    Taxes: ${Number(currentPayroll.deductions?.taxes || 0).toFixed(2)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2">
                                    CPP: ${Number(currentPayroll.deductions?.CPP || 0).toFixed(2)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2">
                                    EI: ${Number(currentPayroll.deductions?.EI || 0).toFixed(2)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                  <Typography variant="body2">
                                    Other: ${Number(currentPayroll.deductions?.otherDeductions || 0).toFixed(2)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                              >
                                Download Pay Stub
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                      
                      {index < filteredPayrolls.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}
        </Paper>
      </Box>
    );
  };

  return renderContent();
}

export default PayStub;
