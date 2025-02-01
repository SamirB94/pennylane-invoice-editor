import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ApiProvider } from "../api";

import "bootstrap/dist/css/bootstrap.min.css";

const domRoot = document.getElementById("root");
const root = createRoot(domRoot!);

root.render(
  <React.StrictMode>
    <ApiProvider
      url="https://jean-test-api.herokuapp.com/"
      token="7e91b897-8ba0-407a-b657-68ae6c1f872f" // set your api token here
    >
      <App />
    </ApiProvider>
  </React.StrictMode>
);
