import { useAuth0 } from "@auth0/auth0-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { queryClient } from "./api/client";
import Analytics from "./pages/Analytics";
import Conversation from "./pages/Conversation";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  let routes;
  if (!isAuthenticated) {
    routes = (
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else if (isAuthenticated && user) {
    routes = (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/conversation/:id" element={<Conversation />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>{routes}</QueryClientProvider>
  );
}

export default App;
