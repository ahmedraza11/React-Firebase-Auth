import React from "react";
import { Card, Spinner } from "react-bootstrap";

import styles from "./../styles.module.scss";

export const CardItem = ({
  val,
  createOrder,
  userObject,
  clickedItem,
  dumbed,
}) => {
  if (dumbed) {
    return (
      <Card
        style={{
          backgroundColor: "#b2bec3",
        }}
        className={styles.card}
      >
        <div className={styles.cardBody}>
          <h3 className={`${val.type === clickedItem && styles.h3Styles}`}>
            {val.title}
          </h3>
        </div>
      </Card>
    );
  }
  return (
    <Card
      style={{ backgroundColor: val.backgroundColor }}
      className={styles.card}
      onClick={() =>
        !(val.type === clickedItem) && createOrder(val.type, userObject.uid)
      }
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
