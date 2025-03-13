import apiClient from '../../api/apiClient';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserIdFromToken } from "../../utilis/token"; // Import utility
import{
    reportPending,
    reportSuccess,
    reportFailure,
    reportCreateSuccess,
    reportUpdateSuccess,
    reportDeleteSuccess,
    reportByIdSuccess
} from '../slices/reportSlice'

// Fetch All reports
export const fetchAllReport = () => async (dispatch) => {
    dispatch(reportPending());
    try {
        const response = await apiClient.get("/api/v1/report")
        dispatch(reportSuccess(response.data.report))
        console.log(response.data.report)
    } catch (error) {
        dispatch(reportFailure(error.response?.data || 'Error fetching Reports')); // Dispatch failure with error message
        console.log("Error Fetching Reports", error.message)
    }
}

// Fetch a Single Report
export const fetchReportById = (reportId) => async (dispatch) => {
    dispatch(reportPending())
    try {
        const response = await apiClient.get(`/api/v1/report/${reportId}`)
        dispatch(reportByIdSuccess(response.data)); // Dispatch success with the user data
    } catch (error) {
        dispatch(reportFailure(error.response?.data || 'Error fetching sites')); // Dispatch failure with error message
        console.log("Error Fetching Report", error.message)
    }
}

export const createReport = (reportData) => async (dispatch) => {
    dispatch(reportPending());
    try {
        const response = await apiClient.post("/api/v1/report", reportData);
        console.log('Create report response:', response.data);
        dispatch(reportCreateSuccess(response.data));
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data || 'Error Creating Report';
        dispatch(reportFailure(errorMessage));
        console.error("Error Creating Reports:", error.message);
        throw error;
    }
};

// Create a Report
export const updateReport = (reportId, reportData) => async (dispatch) => {
    dispatch(reportPending());
    try {
        const response = await apiClient.put(`/api/v1/report/${reportId}`, reportData)
        dispatch(reportUpdateSuccess(response.data))
    } catch (error) {
        dispatch(reportFailure(error.response?.data || 'Error Updating Report')); // Dispatch failure with error message
        console.log("Error Updating Reports", error.message)
    }
}

// Delte a Report
export const DeleteReport = (reportId) => async (dispatch) => {
    dispatch(reportPending());
    try {
        const response = await apiClient.delete(`/api/v1/report/${reportId}`)
        dispatch(reportDeleteSuccess(reportId))
    } catch (error) {
        dispatch(reportFailure(error.response?.data || 'Error Deleting Report')); // Dispatch failure with error message
        console.log("Error Deleting Reports", error.message)
    } 
}

export const fetchReportsByEmployee = () => async (dispatch) => {
    dispatch(reportPending());
    try {
        const response = await apiClient.get("/api/v1/report/emp/employee");
        console.log('Fetched reports:', response.data.reports);
        
        if (!Array.isArray(response.data.reports)) {
            console.error('Expected reports array but got:', typeof response.data.reports);
            dispatch(reportSuccess([]));
            return;
        }
        
        // Sort reports by date, most recent first
        const sortedReports = response.data.reports.sort((a, b) => 
            new Date(b.incidentDate) - new Date(a.incidentDate)
        );
        
        dispatch(reportSuccess(sortedReports));
    } catch (error) {
        const errorMessage = error.response?.data || 'Error fetching reports';
        dispatch(reportFailure(errorMessage));
        console.error("Error Fetching reports:", error.message);
    }
};