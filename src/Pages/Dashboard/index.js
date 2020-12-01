import React, { useState, useEffect } from "react";

import { LoaderScreen } from "./../../Components/index";
import { EmployeeDashboard } from "./dashboard";
import { WorkerPanel } from "./../WorkerPanel";
import { db, auth } from "./../../firebase";

export const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState();
  const [userObject, setUserObject] = useState();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    let unSubUserSnap;
    setLoader(true);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserObject(user);
      if (user) {
        unSubUserSnap = db
          .collection("users")
          .where("user_id", "==", user.uid)
          .onSnapshot((snap) =>
            snap.forEach((val) => {
              setCurrentUser(val.data());
              setLoader(false);
            })
          );
      }
      setLoader(false);
    });

    return () => {
      unsubscribe();
      unSubUserSnap();
    };
  }, []);

  if (loader || !currentUser) {
    return <LoaderScreen />;
  } else {
    return currentUser?.role == "employee" ? (
      <EmployeeDashboard />
    ) : (
      <WorkerPanel />
    );
  }
};
