import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes, { flattenRoutes } from "./router";

function App() {
  return (
    <div className="px-5">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/invoices" replace />} />
          {flattenRoutes(routes).map(({ key, path, component }) => (
            <Route
              key={key}
              path={path}
              element={component({ key, path, component })}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
