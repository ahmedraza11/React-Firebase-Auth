import React, { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../Contexts/AuthContext";
import styles from "./styles.module.scss";
import { OrderRow } from "./utils";
import { db } from "../../firebase";

export const WorkerPanel = () => {
  const [orderList, setOrderList] = useState([]);
  const [appStatus, setAppStatus] = useState("Offline");
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const audioRef = useRef();
  const history = useHistory();

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  const getAllOrders = () => {
    return db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let data = [];
        snap.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setOrderList(data);
        play();
        setLoading(false);
      });
  };

  const getAppStatus = () => {
    return db
      .collection("app")
      .doc("mikaels_panda")
      .onSnapshot(function (doc) {
        setAppStatus(doc.data()?.status);
      });
  };

  const handleAppStatus = () => {
    try {
      db.collection("app")
        .doc("mikaels_panda")
        .update({
          status: appStatus == "Online" ? "Offline" : "Online",
        })
        .then(() => {});
    } catch (err) {}
  };

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {}
  }

  useEffect(() => {
    getAppStatus();
    getAllOrders();
    return () => {
      getAppStatus();
      getAllOrders();
    };
  }, []);

  return (
    <Container className={styles.workPanel_container}>
      <header>
        <img src={`${window.location.origin}/images/logo-black-svg (1).png`} />
        <div className={styles.workerPanelHeaderBtnContainer}>
          <button
            className={styles.workerPanelHeaderBtnContainerLogoutBtn}
            onClick={handleLogout}
          >
            Log Out
          </button>
          <button
            onClick={handleAppStatus}
            className={
              appStatus == "Online"
                ? styles.appOnlineStatusBtn
                : styles.appOffileStatusBtn
            }
          >
            {appStatus} <div></div>
          </button>
        </div>
      </header>
      <audio ref={audioRef}>
        <source
          src="https://res.cloudinary.com/duhaflump/video/upload/v1604329046/simple_message.mp3"
          type="audio/mpeg"
        />
      </audio>
      <div className={styles.orderRowsContainer}>
        <OrderRow
          loading={loading}
          orderList={orderList || []}
          status="pending"
          title="New"
        />
        <OrderRow
          loading={loading}
          orderList={orderList || []}
          status="preparing"
          title="Preparing"
        />
        <OrderRow
          loading={loading}
          orderList={orderList || []}
          status="completed"
          title="Completed"
        />
      </div>
    </Container>
  );
};
