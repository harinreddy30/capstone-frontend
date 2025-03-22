const initialState = {
  payrolls: [],
  employeePayrolls: [],
  loading: false,
  error: null,
  currentPayroll: null
};

const payrollReducer = (state = initialState, action) => {
  switch (action.type) {
    // ... existing cases ...

    case 'FETCH_EMPLOYEE_PAYROLLS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'FETCH_EMPLOYEE_PAYROLLS_SUCCESS':
      return {
        ...state,
        loading: false,
        employeePayrolls: action.payload,
        error: null
      };

    case 'FETCH_EMPLOYEE_PAYROLLS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default payrollReducer; 