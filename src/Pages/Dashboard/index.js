import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";

import { useAuth } from "../../Contexts/AuthContext";
import { LoaderScreen } from "./../../Components/index";
import { db, auth } from "./../../firebase";
import { itemsList, CardItem } from "./utils";
import styles from "./styles.module.scss";
import { WorkerPanel } from "./../";

const EmployeeDashboard = () => {
  const [error, setError] = useState("");
  const [appStatus, setAppStatus] = useState("Offline");
  const [clickedItem, setClickedItem] = useState("");
  const { userObject, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const getAppStatus = () => {
    try {
      db.collection("app")
        .doc("mikaels_panda")
        .onSnapshot(function (doc) {
          setAppStatus(doc.data().status);
        });
    } catch (err) {}
  };

  useEffect(() => {
    getAppStatus();
  }, []);

  const createOrder = async (type, uid) => {
    setError("");
    if (userObject.displayName) {
      try {
        db.collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            setClickedItem(type);
            const { verified } = doc.data();
            db.collection("orders")
              .where("order_by", "==", uid)
              .where("status", "==", "pending")
              .get()
              .then((docs) => {
                let data = [];
                docs.forEach((val) => {
                  data.push(val.data());
                });
                if (verified) {
                  if (data.length < 2) {
                    setClickedItem(type);
                    db.collection("orders")
                      .add({
                        type: type,
                        createdAt: new Date(),
                        order_by: uid,
                        username: userObject.displayName,
                        status: "pending",
                      })
                      .then(() => {
                        setClickedItem("");
                        swal("Order Successfully created!", "", "success");
                      })
                      .catch((err) => {
                        setClickedItem("");
                        alert("Error Error!", err);
                      });
                  } else {
                    swal(
                      "Order Limit Exeption ♨️",
                      "Your orders are > than 3, await till your orders resolved 🤪"
                    );
                    setClickedItem("");
                  }
                } else {
                  swal(
                    "Sorry! You are not verified user!",
                    "Kindly contact your admin for being verified",
                    "error"
                  );
                  setClickedItem("");
                }
              });
          });
      } catch {
        setClickedItem("");
        setError("Failed to log out");
      }
    } else {
      swal(
        "For what name should I know you? 🤔",
        "Kindly update you profile name",
        "error"
      );
    }
  };

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.dashboard_header}>
        <img src={`${window.location.origin}/images/logo-black-svg.png`} />
      </div>
      <Container className={styles.dashboard_inner_container}>
        <div className={styles.mainContainer}>
          <p className={styles.portalStatusText}>
            Portal is {appStatus}{" "}
            <div
              className={
                appStatus == "Online"
                  ? styles.onlineCircle
                  : styles.offlineCircle
              }
            />
          </p>
          <h3>
            Hi 👋{" "}
            {userObject && userObject.displayName
              ? userObject.displayName
              : "Buddy"}
            , What you'd like to have:
          </h3>
          <div className={styles.order_cards_container}>
            {itemsList.map((val, idx) =>
              appStatus == "Online" ? (
                <CardItem
                  createOrder={createOrder}
                  key={idx}
                  val={val}
                  userObject={userObject}
                  clickedItem={clickedItem}
                />
              ) : (
                <CardItem key={idx} val={val} dumbed />
              )
            )}
          </div>
        </div>
        <footer className={styles.footer}>
          <img
            src={`${window.location.origin}/images/logo-black-svg.png`}
            style={{ width: "163px", height: "19px" }}
          />
          <div className={styles.bottomBar}>
            <Link className={styles.footer_btn} to="/update-profile">
              Update Profile
            </Link>
            <span className={styles.footer_btn} onClick={handleLogout}>
              Log Out
            </span>
          </div>
        </footer>
      </Container>
    </div>
  );
};

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
