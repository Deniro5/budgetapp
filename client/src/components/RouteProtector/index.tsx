import React, { useEffect } from "react";
import useStore from "store/user/userStore";
import { useNavigate, useLocation } from "react-router-dom";

type RouteProtectorProps = {
  children: React.ReactNode;
};

export default function RouteProtector({ children }: RouteProtectorProps) {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user, location.pathname]);

  return children;
}
