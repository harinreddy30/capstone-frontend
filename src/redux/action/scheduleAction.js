import {
    schedulePending,
    scheduleSuccess,
    scheduleFailure,
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
        
        const response = await apiClient.post("/api/v1/schedule", scheduleData);
        console.log("Schedule created:", response.data);
        
//         dispatch(scheduleCreateSuccess(response.data));
//         return response.data;
//     } catch (error) {
//         console.error("Error in createSchedule:", error);
//         dispatch(scheduleFailure(error.message));
//         return null;
//     }
// };

// Get All Schedules (for HR/Manager)
export const fetchSchedule = () => async (dispatch) => {
    dispatch(schedulePending());
    try {
        const response = await apiClient.get(`/api/v1/schedule/employee/schedule`);
        console.log("Fetched Schedule:", response.data.schedule);

        if (!Array.isArray(response.data.schedule)) {
            console.error("Error: Expected an array but got", response.data.schedule);
        }

        console.log("Dispatching scheduleSuccess...");
        dispatch(scheduleSuccess(response.data.schedule)); // Log this before dispatching
    } catch (error) {
        console.error("Error in getUserSchedules:", error);
        dispatch(scheduleFailure(error.message));
    }
};

export const getAllSchedules = () => async (dispatch) => {
    try {
        dispatch(schedulePending());
        const response = await apiClient.get("/api/v1/schedule");
        dispatch(scheduleSuccess(response.data.schedule));
        return response.data.schedule;
    } catch (error) {
        console.error("Error in getAllSchedules:", error);
        dispatch(scheduleFailure(error.message));
        return null;
    }
};

// Get User's Schedules
export const getUserSchedules = (userId) => async (dispatch) => {
    try {
        dispatch(schedulePending());
        const response = await apiClient.get(`/api/v1/schedule/${userId}`);
        dispatch(userSchedulesSuccess(response.data));
        return response.data;
    } catch (error) {
        console.error("Error in getUserSchedules:", error);
        dispatch(scheduleFailure(error.message));
    }
};

// Update Schedule
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