import "./App.css";
import { BrowserRouter as BrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useEffect, useContext, useCallback } from "react";
import Header from "./components/Headers";
import Products from "./Components/ProductTypes/Products";
import Items from "./Components/ProductTypes/Items";
import Context from "./Context";

import styles from "./App.module.scss";

const App = () => {
  const { linkSuccess, isItemAccess, isPaymentInitiation, dispatch } =
    useContext(Context);

  const getInfo = useCallback(async () => {
    const response = await fetch("http://localhost:8000/api/info", {
      method: "POST",
    });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { backend: false } });
      return { paymentInitiation: false };
    }
    const data = await response.json();
    const paymentInitiation: boolean =
      data.products.includes("payment_initiation");
    dispatch({
      type: "SET_STATE",
      state: {
        products: data.products,
        isPaymentInitiation: paymentInitiation,
      },
    });
    return { paymentInitiation };
  }, [dispatch]);

  const generateToken = useCallback(async (isPaymentInitiation: any) => {
    // Link tokens for 'payment_initiation' use a different creation flow in your backend.
    const path = isPaymentInitiation
      ? "/api/create_link_token_for_payment"
      : "/api/create_link_token";
    const response = await fetch("http://localhost:8000" + path, {
      method: "POST",
    });
    if (!response.ok) {
      dispatch({ type: "SET_STATE", state: { linkToken: null } });
      return;
    }
    const data = await response.json();
    if (data) {
      if (data.error != null) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: null,
            linkTokenError: data.error,
          },
        });
        return;
      }
      dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
    }
    // Save the link_token to be used later in the Oauth flow.
    localStorage.setItem("link_token", data.link_token);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { paymentInitiation } = await getInfo(); // used to determine which path to take when generating token
      // do not generate a new token for OAuth redirect; instead
      // setLinkToken from localStorage
      if (window.location.href.includes("?oauth_state_id=")) {
        dispatch({
          type: "SET_STATE",
          state: {
            linkToken: localStorage.getItem("link_token"),
          },
        });
        return;
      }
      generateToken(paymentInitiation);
    };
    init();
  }, [dispatch, generateToken, getInfo]);

  //linksucess means we have logged in successfully. only show info after that point

  return (
    <div className={styles.App}>
      {linkSuccess || true ? (
        <BrowserRouter>
          <MainLayout />
        </BrowserRouter>
      ) : (
        <Header />
      )}
    </div>
  );
};

export default App;
