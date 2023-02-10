import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { v4 as uuid } from "uuid";

import Editor from "./components/Editor";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/docs/${uuid()}`} replace={true} />}
          />
          <Route path="/docs/:id" element={<Editor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
