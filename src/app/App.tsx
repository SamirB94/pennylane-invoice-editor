import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  InvoiceCreatePage,
  InvoiceReviewPage,
  InvoiceEditPage,
  InvoicesListPage,
} from "./pages";

function App() {
  return (
    <div className="px-5">
      <Router>
        <Routes>
          <Route path="/" Component={InvoicesListPage} />
          <Route path="/invoice/:id" Component={InvoiceReviewPage} />
          <Route path="/create-invoice" Component={InvoiceCreatePage} />
          <Route path="/edit-invoice/:id" Component={InvoiceEditPage} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
