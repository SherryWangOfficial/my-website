import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import "./FlowingMenu.css";

function FlowingMenu({ items = [] }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const items = menuRef.current.querySelectorAll(".menu__item");

    gsap.fromTo(
      items,
      (el) => {
        const isEven = Array.from(items).indexOf(el) % 2 === 0;
        return {
          opacity: 0,
          x: isEven ? -200 : 200,
        };
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div className="menu-wrap" ref={menuRef}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image }) {
  return (
    <div className="menu__item" style={{ position: "relative", overflow: "hidden" }}>
      {link ? (
        <Link
          className="menu__item-link"
          to={link}
          style={{ position: "relative", zIndex: 2 }}
        >
          {text}
        </Link>
      ) : (
        <span
          className="menu__item-link"
          style={{
            position: "relative",
            zIndex: 2,
            cursor: "default",
            opacity: 0.6,
          }}
        >
          {text}
        </span>
      )}
      <div
        className="hover-bg"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
    </div>
  );
}

export default FlowingMenu;
