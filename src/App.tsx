import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./AppRouter";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <ToastContainer limit={3} />
      <AppRouter />
      {/* <Header2 /> */}
      {/* <LoginMain /> */}
      {/* <Home /> */}
    </Router>
  );
}

export default App;
