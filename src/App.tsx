import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, SignIn, SignUp } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Cars from "./pages/Cars";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import { ToastContainer } from "react-toastify";

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
                <Dashboard />
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
                <Users />
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
                <Cars />
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
                <Transactions />
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
                <Reports />
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
