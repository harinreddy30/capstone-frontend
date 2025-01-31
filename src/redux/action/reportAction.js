import apiClient from '../../api/apiClient';
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
        console.log(response)
        dispatch(reportSuccess(response.data))
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
// Create a Report
export const createReport = (reportData) => async (dispatch) => {
    // console.log(reportData)
    dispatch(reportPending());
    try {
        const response = await apiClient.post("/api/v1/report", reportData)
        console.log(response.data)
        dispatch(reportCreateSuccess(response.data))
    } catch (error) {
        dispatch(reportFailure(error.response?.data || 'Error Creating Report')); // Dispatch failure with error message
        console.log("Error Creating Reports", error.message)
    }
}

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