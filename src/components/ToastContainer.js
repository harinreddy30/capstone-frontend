import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

export default ToastMessage;
