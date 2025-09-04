import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useEffect, useContext, useCallback } from "react";

import useUserStore from "./store/user/userStore";
import RouteProtector from "./components/RouteProtector";
import HomeRedirect from "./components/HomeRedirect";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import LoadingComponent from "components/LoadingComponent/LoadingComponent";

const App = () => {
  const { checkAuth, isCheckingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isCheckingAuth ? (
    <LoadingComponent message="Checking authentication..." />
  ) : (
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
          path="/signup"
          element={
            <HomeRedirect>
              <SignUp />
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
