import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { userObject } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => {
        return userObject ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    ></Route>
  );
};
