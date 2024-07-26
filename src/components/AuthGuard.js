"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        window.location.href = "/admin";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {React.cloneElement(children, { user })} {/* Passa o usuário como prop */}
    </>
  );
};

export default AuthGuard;
