import React, { useEffect } from "react";
import useStore from "../../zustand/user/userStore";
import { useNavigate } from "react-router-dom";

type RouteProtectorProps = {
  children: React.ReactNode;
};

export default function RouteProtector({ children }: RouteProtectorProps) {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, user]);

  return children;
}
