import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useThunk } from "use-thunk";
import InitPage from "../components/InitPage";
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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/init" element={<InitPage />} />
      </Routes>
    </Router>
  );
};
