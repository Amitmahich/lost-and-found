import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";

export default function AdminPrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setCheckingRole(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching admin role:", error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkAdminStatus();
  }, [user, loading]);

  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }

  // ✅ Non-admin users redirect to signin (not dashboard)
  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
