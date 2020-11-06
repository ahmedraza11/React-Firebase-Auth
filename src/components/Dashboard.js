import React, { useState, useEffect, useContext } from "react";
import { Card, Button, Alert, Container, Spinner } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";

import { db, auth } from "./../firebase";
import { useAuth, AuthContext } from "../contexts/AuthContext";
import WorkerPanel from "./workerPanel";
import styles from "./styles.module.css";

const items = [
  {
    title: "Chai | Tea",
    type: "Tea",
    backgroundColor: "#fd7e14",
  },
  {
    title: "Coffee",
    type: "Coffee",
    backgroundColor: "#17a2b8",
  },
  {
    title: "Black Coffee",
    type: "Black Coffee",
    backgroundColor: "#dc3545",
  },
  {
    title: "Green tea",
    type: "Green Tea",
    backgroundColor: "#009688",
  },
  {
    title: "Come to me",
    type: "Come to me",
    backgroundColor: "#607d8b",
  },
];

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
    <div className={styles.dashboardContainer}>
      <img src={`${window.location.origin}/images/logo-black-svg.png`} />
      <Container style={{ background: "black", color: "#fff" }}>
        <div className={styles.mainContainer}>
          <p className={styles.portalStatusText}>
            Portal is {appStatus}{" "}
            <div
              className={
                appStatus == "Online"
                  ? styles.onlineCircle
                  : styles.offlineCircle
              }
            ></div>
          </p>
          <h3>
            Hi 👋{" "}
            {userObject && userObject.displayName
              ? userObject.displayName
              : "Buddy"}
            !, What you'd like to have:
          </h3>

          <div className={styles.cardContainer}>
            {items.map((val, idx) =>
              appStatus == "Online" ? (
                <CardItem
                  createOrder={createOrder}
                  key={idx}
                  val={val}
                  userObject={userObject}
                  clickedItem={clickedItem}
                />
              ) : (
                <Card
                  style={{
                    width: "18rem",
                    backgroundColor: "#b2bec3",
                  }}
                  className={styles.card}
                >
                  <div className={styles.cardBody}>
                    <h3
                      className={`${
                        val.type === clickedItem && styles.h3Styles
                      }`}
                    >
                      {val.title}
                    </h3>
                  </div>
                </Card>
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

const CardItem = ({ val, createOrder, userObject, clickedItem }) => {
  return (
    <Card
      style={{ width: "18rem", backgroundColor: val.backgroundColor }}
      className={styles.card}
      onClick={() => createOrder(val.type, userObject.uid)}
    >
      <div className={styles.cardBody}>
        <h3 className={`${val.type === clickedItem && styles.h3Styles}`}>
          {val.title}
        </h3>
        {val.type === clickedItem && (
          <Spinner animation="grow" variant="light" />
        )}
      </div>
    </Card>
  );
};

export default () => {
  // const { currentUser, loading } = useAuth();
  // const AuthState = useContext(AuthContext);
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

  // useEffect(() => {
  //   console.log("effect", loading);
  //   if (currentUser) {
  //     console.log("currrentUserrrrr", currentUser, loading);
  //     setLoader(false);
  //   }
  // }, [currentUser, AuthState]);

  // useEffect(() => {
  //   console.log("loadingffffff", loading, currentUser);
  // }, [loading]);

  if (loader || !currentUser) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loaderInnerContainer}>
          <div className={styles.overlay_container}>
            <img
              src={`${window.location.origin}/images/logo-black-svg.png`}
              style={{ width: "300px", marginBottom: "50px" }}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return currentUser?.role == "employee" ? (
      <EmployeeDashboard />
    ) : (
      <WorkerPanel />
    );
  }
};
