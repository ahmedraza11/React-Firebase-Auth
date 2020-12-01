import { db, auth } from "../firebase";

export class Services {
  static getAppStatus(setAppStatus) {
    return db
      .collection("app")
      .doc("mikaels_panda")
      .onSnapshot(function (doc) {
        setAppStatus(doc.data().status);
      });
  }

  static getCurrentUserOrders(setCurrentUserOrders, userId) {
    return db
      .collection("orders")
      .where("order_by", "==", userId)
      .where("status", "!=", "completed")
      .onSnapshot(function (docs) {
        let data = [];
        docs.forEach((val) => {
          data.push(val.data());
        });
        setCurrentUserOrders(data);
      });
  }
}
