import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import { ToastContainer } from "react-toastify";
import WaitingApproval from "./pages/WaitingApproval";
import AdminRoute from "./routes/AdminRoutes";
import Approval from "./pages/Approval";


function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Pages */}
          <Route path="https://bold-duckling-70.accounts.dev/sign-in" element={<SignIn />} />
          <Route path="https://bold-duckling-70.accounts.dev/sign-up" element={<SignUp />} />

          {/* Protected Pages */}
          <Route
            path="/"
            element={
             <>
              <SignedIn>
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
             </>
            }
          />
          <Route
            path="/users"
            element={
              <>
              <SignedIn>
               <AdminRoute>
                 <Users />
               </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
              </>
            }
          />
          <Route
            path="/cars"
            element={
             <>
              <SignedIn>
               <AdminRoute>
                 <Cars />
               </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
             </>
            }
          />
          <Route
            path="/transaction"
            element={
             <>
              <SignedIn>
                <AdminRoute>
                  <Transactions />
                </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
             </>
            }
          />
          <Route
            path="/reports"
            element={
              <>
              <SignedIn>
               <AdminRoute>
                 <Reports />
               </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
              </>
            }
          />

          <Route
            path="/waiting-approval"
            element={
              <>
              <SignedIn>
                <WaitingApproval />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
              </>
            }
          />

            <Route
            path="/admin-approval-users"
            element={
              <>
              <SignedIn>
                <AdminRoute>
                  <Approval />
                </AdminRoute>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn/>
              </SignedOut>
              </>
            }
          />

          {/* Redirect to sign-in if not signed in */}
          <Route
            path="*"
            element={
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
