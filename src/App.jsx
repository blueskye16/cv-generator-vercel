import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "@pages/Home";
// import About from "@pages/About";
import Record from "@pages/Record";
import { useThemeStore } from "@hooks/useThemeStore";
import { useEffect } from "react";

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/record" element={<Record />} />
        </Routes>
      </Router>
    </div>
  );
}
