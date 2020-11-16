import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Login, Signup, UpdateProfile, Dashboard } from "./../index";
import { AuthProvider } from "../../Contexts/AuthContext";
import { PrivateRoute } from "./../../Components";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
