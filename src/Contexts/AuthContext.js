import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [userObject, setUserObject] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  async function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return userObject.updateEmail(email);
  }

  async function updateDisplayName(name) {
    await userObject.updateProfile({ displayName: name });
    await db
      .collection("users")
      .doc(userObject.uid)
      .update({ displayName: name });
  }

  function updatePassword(password) {
    return userObject.updatePassword(password);
  }

  useEffect(() => {
    let unSubUserSnap;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserObject(user);
      if (user) {
        unSubUserSnap = db
          .collection("users")
          .where("user_id", "==", user.uid)
          .onSnapshot((snap) =>
            snap.forEach((val) => {
              setCurrentUser(val.data());
              setLoading(false);
            })
          );
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      unSubUserSnap();
    };
  }, []);

  const generateUserDocument = async (user) => {
    if (!user) return;
    const userRef = await db.collection("users").doc(`${user.uid}`);
    const snapshot = await userRef.get();
    if (!snapshot.exists) {
      const { email, displayName, photoURL, uid } = user;
      try {
        await userRef.set({
          displayName,
          email,
          photoURL,
          verified: false,
          role: "employee",
          user_id: uid,
        });
      } catch (error) {
        console.error("Error creating user document", error);
      }
    }
    return getUserDocument(user.uid);
  };
  const getUserDocument = async (uid) => {
    if (!uid) return null;
    try {
      const userDocument = await db.doc(`users/${uid}`).get();
      return {
        uid,
        ...userDocument.data(),
      };
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  const value = {
    currentUser,
    userObject,
    loading,
    updateDisplayName,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    generateUserDocument,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
