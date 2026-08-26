import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useThunk } from "use-thunk";
import RegisterPage from "../components/RegisterPage";
import * as DoHeader from "../thunks/header";

export default () => {
  const [_, doHeader, headerID] = useThunk<DoHeader.State, typeof DoHeader>(
    DoHeader,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};
