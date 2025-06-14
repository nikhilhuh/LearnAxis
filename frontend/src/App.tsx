import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AppProvider } from "./context/AppProvider";

function App() {
  return (
    <div>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </div>
  );
}

export default App;
