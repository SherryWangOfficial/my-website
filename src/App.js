import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Silk from "./Silk";
import AboutMePage from './AboutMePage';
import Contacts from './Contacts';
import Announcement from "./Annoucement";
import Gallery from './Gallery';
import BookArtPage from './BookArtStore';
import FAQ from "./FAQ";
import "@fontsource/fleur-de-leah";
import "./App.css";

// FlowingMenu Component with <Link>
function FlowingMenu({ items = [] }) {
  return (
    <div className="menu-wrap">
      <nav className="menu">
        {items.map((item, idx) => (
          <div
            className="menu__item"
            key={idx}
            style={{ position: "relative", overflow: "hidden" }}
          >
            {item.link ? (
              <Link
                className="menu__item-link"
                to={item.link}
                style={{ position: "relative", zIndex: 2 }}
              >
                {item.text}
              </Link>
            ) : (
              <span className="menu__item-link" style={{ position: "relative", zIndex: 2 }}>
                {item.text}
              </span>
            )}
            <div
              className="hover-bg"
              style={{ backgroundImage: `url(${item.image})` }}
            />
          </div>
        ))}
      </nav>
    </div>
  );
}

// Loading Component
function Loading({ dots }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        width: "100vw",
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "Garamond, serif",
      }}
    >
      Loading{dots}
    </div>
  );
}

// Welcome Component
function Welcome() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fleur De Leah', cursive",
        fontWeight: 400,
        letterSpacing: "0.05em",
        color: "white",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 28,
          marginBottom: "-0.5em",
          textShadow: "0 0 5px rgba(255, 255, 255, 0.7)",
          lineHeight: 1.2,
          marginLeft: "auto",
          marginRight: "auto",
          transform: "translate(-180px, 140px)",
        }}
      >
        Welcome to
      </div>

      <h1
        style={{
          fontSize: 120,
          margin: "0.1em 0",
          fontFamily: "'Fleur De Leah', cursive",
          animation: "glowPulse 3s ease-in-out infinite",
          background:
            "linear-gradient(90deg, rgb(255, 255, 255), rgb(255, 136, 136), rgb(255, 49, 49))",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 8px rgba(255, 255, 255, 0.6)",
          lineHeight: 1.1,
          paddingBottom: "0.2em",
          marginLeft: "auto",
          marginRight: "auto",
          transform: "translate(0px, 10px)",
          whiteSpace: "pre",
        }}
      >
        {"ㅤ\nㅤSherry Wangㅤ\nㅤ"}
      </h1>
    </div>
  );
}

// Home Page with Flowing Menu
function Home() {
  const menuItems = [
    {
      link: "/about",
      text: "About Sherry Wang",
      image: `https://fastly.picsum.photos/id/82/1500/997.jpg?hmac=VcdCqu9YiLpbCtr8YowUCSUD3-245TGekiXmtiMXotw`,
    },
    {
      link: "/book-art",
      text: "Book Art Store",
      image: `https://picsum.photos/600/400?random=5`,
    },
    {
      link: null,
      text: "🚧 UNDER CONSTRUCTION 🚧",
      image: `https://fastly.picsum.photos/id/180/2400/1600.jpg?hmac=Ig-CXcpNdmh51k3kXpNqNqcDYTwXCIaonYiBOnLXBb8`,
    },
  ];

  return (
    <div
      style={{ height: "100vh", position: "relative", backgroundColor: "black" }}
    >
      <FlowingMenu items={menuItems} />
    </div>
  );
}

// Main App
function App() {
  const [loadingDots, setLoadingDots] = useState("");
  const [loading, setLoading] = useState(() => {
    return sessionStorage.getItem("hasVisited") ? false : true;
  });

  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasVisited", "true");
    }, 6000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <Silk />
        <Welcome />
        <Loading dots={loadingDots} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/book-art" element={<BookArtPage />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
