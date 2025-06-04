import React, { useEffect } from "react";
import useStore from "../../store/user/userStore";
import { useNavigate } from "react-router-dom";

type RouteProtectorProps = {
  children: React.ReactNode;
};

export default function HomeRedirect({ children }: RouteProtectorProps) {
  const { isAuthenticated, user } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user]);

  return children;
}
