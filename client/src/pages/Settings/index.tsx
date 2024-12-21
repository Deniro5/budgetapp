import React from "react";
import useUserStore from "../../zustand/user/userStore";

export default function Settings() {
  const { logout } = useUserStore();
  return <button onClick={logout}>Logout</button>;
}
