import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useEffect, useContext, useCallback } from "react";

import useUserStore from "./zustand/user/userStore";
import RouteProtector from "./components/RouteProtector";
import HomeRedirect from "./components/HomeRedirect";
import Login from "./pages/Login";

const App = () => {
  const { checkAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route
          path="/Login"
          element={
            <HomeRedirect>
              <Login />
            </HomeRedirect>
          }
        />
        <Route
          path="*"
          element={
            <RouteProtector>
              <MainLayout />
            </RouteProtector>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
