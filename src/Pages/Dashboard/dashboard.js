import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Button, Badge } from "react-bootstrap";
import swal from "sweetalert";

import { useAuth } from "../../Contexts/AuthContext";
import { OrderStatus } from "./utils/OrderStatus";
import { itemsList, CardItem } from "./utils";
import { Services } from "./../../Services";
import { db } from "./../../firebase";
import styles from "./styles.module.scss";

export const EmployeeDashboard = () => {
  const [error, setError] = useState("");
  const [showOrderCard, setOrderCardVisible] = useState(false);
  const [appStatus, setAppStatus] = useState("Offline");
  const [clickedItem, setClickedItem] = useState("");
  const [currentUserOrders, setCurrentUserOrders] = useState([]);
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

  useEffect(() => {
    let unSub = Services.getAppStatus(setAppStatus);
    let unSubGetUserOrders = Services.getCurrentUserOrders(
      setCurrentUserOrders,
      userObject?.uid
    );
    return () => {
      unSub();
      unSubGetUserOrders();
    };
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
              .where("status", "!=", "completed")
              .get()
              .then((docs) => {
                let data = [];
                docs.forEach((val) => {
                  data.push(val.data());
                });
                if (verified) {
                  swal(`Are you sure you want to place order for  ${type} ?`, {
                    dangerMode: false,
                    buttons: true,
                  }).then((val) => {
                    if (val) {
                      if (data.length < 2) {
                        setClickedItem(type);
                        if (type !== "Custom") {
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
                              swal(
                                "Order Successfully created!",
                                "",
                                "success"
                              );
                            })
                            .catch((err) => {
                              setClickedItem("");
                              alert("Error Error!", err);
                            });
                        } else {
                          swal("Under construction 🛠️", "...");
                        }
                      } else {
                        swal(
                          "Order Limit Exeption ♨️",
                          "Your orders are > 2 than , await till your orders resolved 🤪"
                        );
                        setClickedItem("");
                      }
                    } else {
                      setClickedItem("");
                    }
                  });
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

  const handleToggleOrderStatusCard = () => {
    setOrderCardVisible((prev) => !prev);
  };

  return (
    <div className={styles.dashboard_container}>
      {showOrderCard && (
        <OrderStatus
          orders={currentUserOrders}
          handleCloseCard={handleToggleOrderStatusCard}
        />
      )}
      <div className={styles.dashboard_header}>
        <img src={`${window.location.origin}/images/logo-black-svg.png`} />
      </div>
      <Container className={styles.dashboard_inner_container}>
        <div className={styles.mainContainer}>
          <div className={styles.subHeader}>
            <p className={styles.portalStatusText}>
              Portal is {appStatus}{" "}
              <span
                className={
                  appStatus == "Online"
                    ? styles.onlineCircle
                    : styles.offlineCircle
                }
              />
            </p>
            <Button onClick={handleToggleOrderStatusCard} variant="primary">
              Orders <Badge variant="light">{currentUserOrders.length}</Badge>
              <span className="sr-only">Orders count</span>
            </Button>
          </div>
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
