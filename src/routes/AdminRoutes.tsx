import React, { useEffect, useState } from "react";
import axios from "axios";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import WaitingApproval from "@/pages/WaitingApproval";

interface User {
  _id: string;
  email: string;
  role: string;
  status: string;
}

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const { data } = await axios.get(
          "https://api.citycarcenters.com/api/v1/secure/route/admin/status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          setUserData(data.user);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching admin status:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [getToken, isSignedIn]);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (loading) return <p>Loading...</p>;

  if (!userData) return <WaitingApproval />;

  if (userData.status !== "approved" || userData.role !== "admin") {
    return <WaitingApproval />;
  }

  return <>{children}</>;
};

export default AdminRoute;
