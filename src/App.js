import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerLogin from "./pages/customer/CustomerLogin";
import PriorityQuestions from "./pages/customer/PriorityQuestions";
import CustomerChat from "./pages/customer/CustomerChat";
import AgentLogin from "./pages/agent/AgentLogin";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentChat from "./pages/agent/AgentChat";
import EcommerceHome from "./pages/EcommerceHome";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Default route — redirect to customer login */}
          <Route path="/" element={<Navigate to="/customer/login" replace />} />

          {/* Public Login Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/agent/login" element={<AgentLogin />} />

          {/* Customer Protected Routes */}
          <Route path="/shop" element={
            <PrivateRoute allowedRole="customer">
              <EcommerceHome />
            </PrivateRoute>
          } />
          <Route path="/customer/questions" element={
            <PrivateRoute allowedRole="customer">
              <PriorityQuestions />
            </PrivateRoute>
          } />
          <Route path="/customer/chat" element={
            <PrivateRoute allowedRole="customer">
              <CustomerChat />
            </PrivateRoute>
          } />

          {/* Agent Protected Routes */}
          <Route path="/agent/shop" element={
            <PrivateRoute allowedRole="agent">
              <EcommerceHome />
            </PrivateRoute>
          } />
          <Route path="/agent/dashboard" element={
            <PrivateRoute allowedRole="agent">
              <AgentDashboard />
            </PrivateRoute>
          } />
          <Route path="/agent/chat/:customerId" element={
            <PrivateRoute allowedRole="agent">
              <AgentChat />
            </PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/customer/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;