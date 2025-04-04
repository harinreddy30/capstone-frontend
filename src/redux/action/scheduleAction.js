// src/redux/action/scheduleAction.js
import {
    schedulePending,
    scheduleFailure,
    siteSchedulesSuccess,
    globalSchedulesSuccess,
    scheduleCreateSuccess,
    scheduleUpdateSuccess,
    scheduleDeleteSuccess,
  } from "../slices/scheduleSlice";
  import apiClient from "../../api/apiClient";
  
  // Create Schedule
  export const createSchedule = (scheduleData) => async (dispatch) => {
    try {
      dispatch(schedulePending());
      console.log("Creating schedule:", scheduleData);
      const payload = { ...scheduleData };
      const response = await apiClient.post("/api/v1/schedule", payload);
      console.log("Schedule created:", response.data);
      dispatch(scheduleCreateSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error in createSchedule:", error);
      dispatch(scheduleFailure(error.message));
      return null;
    }
  };
  
  // Fetch Schedules for a Specific Site
  export const fetchSchedulesBySite = (siteId) => async (dispatch) => {
    try {
      dispatch(schedulePending());
      const response = await apiClient.get(`/api/v1/schedule/site/${siteId}`);
      // Assuming backend returns an array at the top level.
      const schedulesArray = response.data;
      dispatch(siteSchedulesSuccess(schedulesArray));
      return schedulesArray;
    } catch (error) {
      console.error("Error fetching schedules by site:", error);
      dispatch(scheduleFailure(error.message));
      return [];
    }
  };
  
  // Fetch Global Schedules (for HR/Manager or filtering across sites)
  export const fetchGlobalSchedules = () => async (dispatch) => {
    try {
      dispatch(schedulePending());
      const response = await apiClient.get("/api/v1/schedule");
      console.log("Global schedules API response:", response.data);
      const schedulesArray = Array.isArray(response.data)
        ? response.data
        : response.data.schedule || [];
      dispatch(globalSchedulesSuccess(schedulesArray));
      return schedulesArray;
    } catch (error) {
      console.error("Error in fetchGlobalSchedules:", error);
      dispatch(scheduleFailure(error.message));
      return null;
    }
  };
  
  
  export const fetchSchedule = () => async (dispatch) => {
    try {
      dispatch(schedulePending());
      const response = await apiClient.get(`/api/v1/schedule/employee/schedule`);
      console.log("Fetched Schedule:", response.data.schedule);
      // Here we assume the employee's schedule is in response.data.schedule.
      // Dispatch it using the siteSchedulesSuccess action.
      dispatch(siteSchedulesSuccess(response.data.schedule));
      return response.data.schedule;
    } catch (error) {
      console.error("Error in fetchSchedule:", error);
      dispatch(scheduleFailure(error.message));
      return [];
    }
  };
  
  // Update Schedule (including unassigning an employee by setting userId to null)
  export const updateSchedule = (scheduleId, updateData) => async (dispatch) => {
    try {
      dispatch(schedulePending());
      const response = await apiClient.put(`/api/v1/schedule/${scheduleId}`, updateData);
      dispatch(scheduleUpdateSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error("Error in updateSchedule:", error);
      dispatch(scheduleFailure(error.message));
      return null;
    }
  };
  
  // Delete Schedule
  export const deleteSchedule = (scheduleId) => async (dispatch) => {
    try {
      dispatch(schedulePending());
      await apiClient.delete(`/api/v1/schedule/${scheduleId}`);
      dispatch(scheduleDeleteSuccess(scheduleId));
      return true;
    } catch (error) {
      console.error("Error in deleteSchedule:", error);
      dispatch(scheduleFailure(error.message));
      return null;
    }
  };
  