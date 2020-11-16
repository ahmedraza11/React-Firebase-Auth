import React from "react";
import { Card } from "react-bootstrap";
import moment from "moment";

import { db } from "../../firebase";
import styles from "./styles.module.scss";

export const OrderRow = ({ loading, orderList, status, title }) => {
  let filteredList = orderList.filter((val) => val.status === status);

  const handleBtnClick = (item, status) => {
    try {
      db.collection("orders")
        .doc(item.id)
        .update({ updatedAt: new Date(), status: status })
        .then((res) => {});
    } catch (err) {}
  };

  return (
    <div className={styles.orderListContainer}>
      <h5>{title} Orders</h5>
      <div className={styles.orderListInnerContainer}>
        {!loading & (filteredList.length < 1) ? (
          title === "New" ? (
            <p className={styles.no_orderMsg}>
              <img
                src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/male-cook_1f468-200d-1f373.png"
                width="30px"
              />{" "}
              No order's yet 😄
            </p>
          ) : (
            <p className={styles.no_orderMsg}>No {title} Orders.</p>
          )
        ) : loading ? (
          <p>Loading orders ...</p>
        ) : (
          filteredList.map((val, idx) => (
            <div className={styles.order_card_container} key={idx}>
              <Card
                className={styles.order_card}
                style={
                  status == "preparing"
                    ? { background: "#ffeaa7" }
                    : status == "completed"
                    ? { background: "#00b894" }
                    : { background: "#fff" }
                }
              >
                <span className={styles.client_name}>{val?.username}</span>
                <span className={styles.order_time}>
                  {moment(val.createdAt.toDate()).calendar()}
                </span>
                <p>{val.type}</p>
              </Card>
              <div className={styles.orderRow_btnContainer}>
                {status == "pending" ? (
                  <button
                    onClick={() => handleBtnClick(val, "preparing")}
                    className={styles.orderRowBtn}
                  >
                    Start
                  </button>
                ) : status == "preparing" ? (
                  <button
                    onClick={() => handleBtnClick(val, "completed")}
                    className={styles.orderRowBtn}
                  >
                    Done
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
