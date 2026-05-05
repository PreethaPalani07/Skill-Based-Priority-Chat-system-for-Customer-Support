import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const PrivateRoute = ({ children, allowedRole }) => {
  const [status, setStatus] = useState("loading");
  const [redirectPath, setRedirectPath] = useState("/customer/login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth User:", user);

      if (!user) {
        setRedirectPath(
          allowedRole === "agent" ? "/agent/login" : "/customer/login"
        );
        setStatus("denied");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        console.log("Firestore Data:", snap.data());

        if (!snap.exists()) {
          console.log("User document not found!");
          setStatus("denied");
          return;
        }

        const userRole = snap.data()?.role?.toLowerCase();
        const requiredRole = allowedRole.toLowerCase();

        console.log("User Role:", userRole);
        console.log("Allowed Role:", requiredRole);

        if (userRole === requiredRole) {
          setStatus("allowed");
        } else {
          setRedirectPath(
            allowedRole === "agent" ? "/agent/login" : "/customer/login"
          );
          setStatus("denied");
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        setStatus("denied");
      }
    });

    return () => unsubscribe();
  }, [allowedRole]);

  if (status === "loading") {
    return <h2 style={{ textAlign: "center" }}>Checking access...</h2>;
  }

  if (status === "denied") {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;