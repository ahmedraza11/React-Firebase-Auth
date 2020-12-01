import React from "react";
import styles from "../styles.module.scss";

export const OrderStatus = ({ orders, handleCloseCard }) => {
  return (
    <div className={styles.orderStatusCard}>
      <h3>Order Status</h3>
      <div className={styles.orders_list}>
        {orders.map((val, idx) => (
          <div
            key={idx}
            className={`${styles.list_item} ${
              val.status != "pending" && styles.list_item_prepare
            }`}
          >
            <p>{val.type}</p>
            <p>{val.status.toUpperCase()}</p>
          </div>
        ))}
      </div>
      <h4 onClick={handleCloseCard}>X</h4>
    </div>
  );
};
