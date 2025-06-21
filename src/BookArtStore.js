import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import booksData from "./BookArtData";
import emailjs from '@emailjs/browser';
import { useThree } from '@react-three/fiber';

const globalDiscountEnabled = false;
const globalDiscountPercent = 0;
const discountedTag = ""; // e.g., "Health" or leave "" for all books

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  fontSize: "1rem",
  borderRadius: 6,
  border: "1px solid #ccc",
};

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 80,
      right: 20,
      backgroundColor: "#c99b66",
      color: "white",
      padding: "10px 20px",
      borderRadius: 6,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 100,
      userSelect: "none",
      fontWeight: "600",
      fontSize: "1rem",
    }}>
      {message}
    </div>
  );
}

function TrapezoidBlock({ imageUrl, width = 3.5, coverAngle = 25, isMobile}) {

  const zPos = -4 + ((window.innerWidth - 400) / 320);

  const meshRef = useRef();
  const groupRef = useRef();
  const currentTexture = useTexture(imageUrl);
  const [hovered, setHovered] = useState(false);

  // Geometry modification
  const geometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(width, 5.5, 3.3);
    const position = geom.attributes.position;
    const vertexCount = position.count;

    for (let i = 0; i < vertexCount; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);

      if (z > 0) {
        position.setX(i, x * 1.1);
      } else if (z < 0) {
        position.setX(i, x * 0.2);
      }
    }

    position.needsUpdate = true;
    geom.computeVertexNormals();
    return geom;
  }, [width]);

  const angleRadians = (coverAngle * Math.PI) / 180;
  const coverOffsetX = width / 3 + 0.2;

  // Animate rotation based on mouse
  useFrame(({ mouse }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.x * 0.6;
      groupRef.current.rotation.x = -mouse.y * 0.4;
    }
  });

  const materials = [
    <meshStandardMaterial attach="material-0" color="#e0d7c6" key="right" />,
    <meshStandardMaterial attach="material-1" color="#e0d7c6" key="left" />,
    <meshStandardMaterial attach="material-2" color="#e0d7c6" key="top" />,
    <meshStandardMaterial attach="material-3" color="#e0d7c6" key="bottom" />,
    <meshStandardMaterial
      attach="material-4"
      map={currentTexture}
      transparent
      alphaTest={0.1}
      depthWrite={false}
      key="front"
    />,
    <meshStandardMaterial attach="material-5" color="#e0d7c6" key="back" />,
  ];

  return (
    <group
      ref={groupRef}
      position={[0, 0, zPos]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, -1]}>
        {materials}
      </mesh>

      {/* Right Cover */}
      <mesh position={[coverOffsetX, 0, -0.75]} rotation={[0, angleRadians, 0]}>
        <boxGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#c99b66" />
      </mesh>

      {/* Left Cover */}
      <mesh position={[-coverOffsetX, 0, -0.75]} rotation={[0, -angleRadians, 0]}>
        <boxGeometry args={[0.2, 6, 4]} />
        <meshStandardMaterial color="#c99b66" />
      </mesh>

      {/* Spine */}
      <mesh position={[0, 0, -2.35]}>
        <boxGeometry args={[1.2, 6, 0.2]} />
        <meshStandardMaterial color="#c99b66" />
      </mesh>
    </group>
  );
}

function RealisticModel() {
  const ref = useRef();
  const [obj, setObj] = useState(null);

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(
      "./bookImages/3DModel.mtl",
      (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
          "./bookImages/3DModel.obj",
          (loadedObj) => {
            setObj(loadedObj);
          },
          undefined,
          (error) => {
            console.error("Error loading OBJ:", error);
          }
        );
      },
      undefined,
      (error) => {
        console.error("Error loading MTL:", error);
      }
    );
  }, []);

  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y = mouse.x * Math.PI * 0.25;
      ref.current.rotation.x = mouse.y * Math.PI * 0.25;
    }
  });

  if (!obj) return null;

  return (
    <primitive ref={ref} object={obj} scale={[15, 15, 15]} position={[0, 0, 0]} />
  );
}

function Scene({ books, currentIndex, showRealistic, isMobile}) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} />
      <pointLight position={[-5, -5, 5]} intensity={0.8} />

      <Suspense fallback={null}>
        {showRealistic ? (
          <RealisticModel />
        ) : (
          currentIndex !== -1 &&      
          <TrapezoidBlock
            imageUrl={books[currentIndex].imageUrl}
            width={books[currentIndex].width}
            coverAngle={books[currentIndex].coverAngle}
            isMobile={isMobile} 
          />
        )}
      </Suspense>
    </>
  );
}

function FilterPanel({ tags, selectedTags, toggleTag, id }) {
  return (
    <div
      id={id}
      style={{
        position: "absolute",
        top: 60,
        left: 20,
        backgroundColor: "rgba(255,255,255,0.95)",
        borderRadius: 8,
        padding: 12,
        maxWidth: 250,
        zIndex: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>Filter by Tags</h3>
      {tags.map((tag) => (
        <label
          key={tag}
          style={{
            display: "block",
            marginBottom: 6,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            checked={selectedTags.has(tag)}
            onChange={() => toggleTag(tag)}
            style={{ marginRight: 8 }}
          />
          {tag}
        </label>
      ))}
    </div>
  );
}

export default function BookArtPage() {
  const isMobile = useIsMobile();
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showRealistic, setShowRealistic] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isFinalizingCheckout, setIsFinalizingCheckout] = useState(false);
  const [currentCheckoutStep, setCurrentCheckoutStep] = useState(0);
  const [customNotes, setCustomNotes] = useState({}); // title -> message
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userEmail, setUserEmail] = useState("");

  const responsiveButtonStyle = {
    padding: isMobile ? "5px 8px" : "5px 8px",
    fontSize: isMobile ? "0.5rem" : "1.1rem",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  };

  const bookListText = checkoutItems.map((book, i) => {
  const note = customNotes[book.title] || "(none)";
    return `#${i + 1}: ${book.title}\nNotes: ${note}`;
  }).join("\n\n");

  const totalPrice = checkoutItems.reduce((sum, book) => sum + book.price, 0).toFixed(2);


  // Gather all unique tags from books
  const allTags = useMemo(() => {
    const tagSet = new Set();
    booksData.forEach((book) => {
      book.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  // Filter books based on selected tags
  const filteredBooks = useMemo(() => {
    if (selectedTags.size === 0) return booksData;
    return booksData.filter((book) =>
      book.tags.some((tag) => selectedTags.has(tag))
    );
  }, [selectedTags]);

  // Adjust currentIndex if out of range
  useEffect(() => {
    if (filteredBooks.length === 0) {
      setCurrentIndex(-1);
    } else if (currentIndex >= filteredBooks.length || currentIndex === -1) {
      setCurrentIndex(0);
    }
  }, [filteredBooks, currentIndex]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  // Navigate next book
  const handleNext = () => {
    if (filteredBooks.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredBooks.length);
  };

  // Navigate previous book
  const handlePrev = () => {
    if (filteredBooks.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? filteredBooks.length - 1 : prev - 1
    );
  };

  // Toggle between realistic and example model
  const toggleModel = () => {
    setShowRealistic((v) => !v);
  };

  // Add to checkout handler with no duplicates & toast
  const handleAddToCheckout = () => {
    if (currentIndex === -1) return;
    const book = filteredBooks[currentIndex];

    if (!checkoutItems.find(item => item.title === book.title)) {
      setCheckoutItems(prev => [...prev, book]);
      setToastMessage(`Added "${book.title}" to checkout!`);
    } else {
      setToastMessage(`"${book.title}" is already in your checkout.`);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f0f0f0",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        userSelect: "none",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* Filter Button top left */}
      <button
        onClick={() => setFilterOpen((v) => !v)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "8px 16px",
          fontSize: "0.9rem",
          fontWeight: "600",
          cursor: "pointer",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#c99b66",
          color: "white",
          userSelect: "none",
          zIndex: 30,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease",
          ...responsiveButtonStyle,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b07f48")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c99b66")}
        aria-expanded={filterOpen}
        aria-controls="filter-panel"
      >
        {filterOpen ? "Close Filters" : "Open Filters"}
      </button>

      {/* Filter Panel */}
      {filterOpen && (
        <FilterPanel
          id="filter-panel"
          tags={allTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
        />
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ height: "100%" }}>
        <Scene
          books={filteredBooks}
          currentIndex={currentIndex}
          showRealistic={showRealistic}
          isMobile={isMobile}
        />
      </Canvas>

      {/* Title and Description */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? 60 : 20,
          width: "100%",
          textAlign: "center",
          color: "#333",
          padding: "0 20px",
          boxSizing: "border-box",
          zIndex: 10,
          pointerEvents: "none",
          ...responsiveButtonStyle,
        }}
      >
        <h1 style={{ margin: 0, fontWeight: "700" }}>
          {showRealistic
            ? "Realistic Model"
            : currentIndex === -1
            ? "No Books Found"
            : filteredBooks[currentIndex].title}
        </h1>
        {!showRealistic && currentIndex !== -1 && (
          <p style={{ marginTop: 8, fontWeight: "400", fontSize: "1.1rem", ...responsiveButtonStyle,}}>
            {filteredBooks[currentIndex].description}
          </p>
        )}
      </div>

      {/* Toggle Button top right */}
      <button
        onClick={toggleModel}
        style={{
          position: "absolute",
          top: 20,
          left: 150,
          padding: "8px 16px",
          fontSize: "0.9rem",
          fontWeight: "600",
          cursor: "pointer",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#c99b66",
          color: "white",
          userSelect: "none",
          zIndex: 10,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          transition: "background-color 0.3s ease",
          ...responsiveButtonStyle,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b07f48")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c99b66")}
        aria-label="Toggle between example and realistic model"
      >
        {showRealistic ? "Show Example Book" : "Show Realistic Model"}
      </button>

      {/* Price Display */}
      {currentIndex !== -1 && (() => {
        const book = filteredBooks[currentIndex];
        const originalPrice = book.price;
        const isGlobalDiscounted =
          globalDiscountEnabled &&
          (discountedTag === "" || book.tags.includes(discountedTag));
        const isSpecial = !!book.special;
        const hasDiscount = isSpecial || isGlobalDiscounted;

        const discountRate = isGlobalDiscounted ? globalDiscountPercent / 100 : 0.2;
        const discountedPrice = originalPrice * (1 - discountRate);
        const reason = isGlobalDiscounted ? `${globalDiscountPercent}% Off` : book.special;

        return (
          <div
            style={{
              position: "fixed",
              bottom: 70,
              right: 20,
              textAlign: "right",
              fontSize: "1.1rem",
              zIndex: 10,
              color: "#333",
            }}
          >
            {hasDiscount ? (
              <div>
                <div style={{ textDecoration: "line-through", color: "#999" }}>
                  ${originalPrice.toFixed(2)}
                </div>
                <div style={{ fontWeight: "bold", color: "#c99b66" }}>
                  ${discountedPrice.toFixed(2)}{" "}
                  <span style={{ fontSize: "0.9rem", color: "#b07f48" }}>
                    ({reason})
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ fontWeight: "bold" }}>${originalPrice.toFixed(2)}</div>
            )}
          </div>
        );
      })()}

      {/* Navigation Arrows (only if example model & book found) */}
      {!showRealistic && currentIndex !== -1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              top: "50%",
              left: 20,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.4)", // transparent black
              border: "none",
              fontSize: "3rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              padding: 0,
              color: "#fff", // white arrow for contrast
              zIndex: 10,
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              lineHeight: 1,
              textAlign: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1)")
            }
            aria-label="Previous Book"
          >
            <span style={{ display: "inline-block", transform: "translateY(-4px)" }}>←</span>
          </button>


          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              top: "50%",
              right: 20,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.4)", // transparent black circle
              border: "none",
              fontSize: "3rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              padding: 0,
              color: "#fff", // white arrow for contrast
              zIndex: 10,
              width: "3.5rem",
              height: "3.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1)")
            }
            aria-label="Next Book"
          >
            <span style={{ display: "inline-block", transform: "translateY(-4px)" }}>→</span>
          </button>

          {/* Dots */}
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
              zIndex: 20,
              userSelect: "none",
            }}
          >
            {filteredBooks.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: idx === currentIndex ? "#c99b66" : "#ccc",
                  cursor: "pointer",
                  boxShadow: idx === currentIndex ? "0 0 6px #b07f48" : "none",
                  transition: "background-color 0.3s ease",
                }}
                aria-label={`Select book ${idx + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrentIndex(idx);
                  }
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleAddToCheckout}
        disabled={currentIndex === -1}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "12px 22px",
          backgroundColor: "#c99b66",
          color: "white",
          fontWeight: "700",
          fontSize: "1.1rem",
          border: "none",
          borderRadius: 6,
          cursor: currentIndex === -1 ? "not-allowed" : "pointer",
          opacity: currentIndex === -1 ? 0.6 : 1,
          userSelect: "none",
          zIndex: 30,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "background-color 0.3s ease",
          ...responsiveButtonStyle,
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#b07f48";
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#c99b66";
        }}
        aria-label="Add current book to checkout"
      >
        Add to Checkout
      </button>

      {/* View Checkout Button */}
      {checkoutItems.length > 0 && !showCheckout && (
        <button
          onClick={() => setShowCheckout(true)}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "10px 18px",
            backgroundColor: "#555",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            zIndex: 30,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transition: "background-color 0.3s ease",
            ...responsiveButtonStyle,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#555")}
          aria-label="Open checkout list"
        >
          See Checkout
        </button>
      )}

      {/* Checkout List Sidebar */}
      {showCheckout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            backgroundColor: "white",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.15)",
            padding: 20,
            zIndex: 50,
            overflowY: "auto",
            userSelect: "text",
          }}
          aria-label="Checkout items list"
        >
          <h2 style={{ marginTop: 0, marginBottom: 12, color: "#c99b66" }}>Your Checkout</h2>
          {checkoutItems.length === 0 ? (
            <p>No books added yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
            {checkoutItems.map((book, idx) => (
              <li
                key={book.title}
                style={{
                  marginBottom: 10,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 10,
                  fontWeight: "600",
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <img src={book.imageUrl} alt={book.title} style={{ width: 40, height: 60, objectFit: "cover", borderRadius: 4 }} />
                <span style={{ flex: 1 }}>{book.title}</span>
                <button
                  onClick={() =>
                    setCheckoutItems((prev) =>
                      prev.filter((item) => item.title !== book.title)
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c99b66",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    ...responsiveButtonStyle,
                  }}
                  aria-label={`Remove ${book.title} from checkout`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          )}

          {checkoutItems.length > 0 && (
  <button
    onClick={() => {
      setShowCheckout(false);
      setIsFinalizingCheckout(true);
      setCurrentCheckoutStep(0);
    }}
    style={{
      marginTop: 10,
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: "700",
      width: "100%",
      ...responsiveButtonStyle,
    }}
  >
    Complete Checkout
  </button>
)}

          {/* Close Checkout Button */}
          <button
            onClick={() => setShowCheckout(false)}
            style={{
              marginTop: 20,
              backgroundColor: "#c99b66",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "700",
              width: "100%",
              ...responsiveButtonStyle,
            }}
            aria-label="Close checkout list"
          >
            Close
          </button>
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

        {isFinalizingCheckout && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "white",
      zIndex: 100,
      overflowY: "auto",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    {currentCheckoutStep < checkoutItems.length ? (
      <>
        <h2 style={{ color: "#c99b66" }}>
          Custom Notes for: {checkoutItems[currentCheckoutStep].title}
        </h2>
        <img
        src={checkoutItems[currentCheckoutStep].imageUrl}
        alt={checkoutItems[currentCheckoutStep].title}
        style={{ width: 120, height: 180, objectFit: "cover", borderRadius: 6, marginBottom: 20 }}
        />

        <textarea
          placeholder= "Add any additional notes here. Note any design changes (such as adding color) will affect the price"
          value={customNotes[checkoutItems[currentCheckoutStep].title] || ""}
          onChange={(e) =>
            setCustomNotes((prev) => ({
              ...prev,
              [checkoutItems[currentCheckoutStep].title]: e.target.value,
            }))
          }
          style={{
            width: "100%",
            minHeight: 120,
            fontSize: "1rem",
            padding: 10,
            marginTop: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => setCurrentCheckoutStep((s) => s + 1)}
            style={{
              backgroundColor: "#c99b66",
              color: "white",
              padding: "10px 20px",
              fontWeight: "bold",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              ...responsiveButtonStyle,
            }}
          >
            Next
          </button>
        </div>
      </>
    ) : (
      <>
        <h2 style={{ color: "#c99b66" }}>Enter Your Information</h2>
<input
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
  style={inputStyle}
/>
<input
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
  style={inputStyle}
/>
<input
  placeholder="Email"
  type="email"
  value={userEmail}
  onChange={(e) => setUserEmail(e.target.value)}
  style={inputStyle}
/>

<div style={{ marginTop: 20 }}>
  <button
    onClick={async () => {
  if (!firstName.trim() || !lastName.trim() || !userEmail.trim()) {
    setToastMessage("Please fill out all fields.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    setToastMessage("Please enter a valid email address.");
    return;
  }

  try {
    const bookListText = checkoutItems.map((book, i) => {
    const note = customNotes[book.title] || "(none)";
    return `#${i + 1}: ${book.title}\nPrice: $${book.price.toFixed(2)}\nNotes: ${note}`;
  }).join("\n\n");

    const totalPrice = checkoutItems
      .reduce((sum, book) => sum + book.price, 0)
      .toFixed(2);

    await emailjs.send(
      "service_jq2e4pa",
      "template_j3f9oqk",
      {
        name: `${firstName} ${lastName}`,
        email: userEmail,
        book_list: `${bookListText}\n\nTotal: $${totalPrice}`,
      },
      "2__eX2BWVRQakWk7H"
    );

    setToastMessage("Order submitted to Sherry Wang successfully! Please wait for a reply back through email soon to verify purchase! Thank you!");
    setIsFinalizingCheckout(false);
    setShowCheckout(false);
    setCheckoutItems([]);
    setFirstName('');
    setLastName('');
    setUserEmail('');
    setCustomNotes({});
  } catch (err) {
    console.error("EmailJS error:", err);
    setToastMessage("Failed to send order. Please try again.");
  }

    }}
    style={{
      backgroundColor: "#4CAF50",
      color: "white",
      padding: "10px 20px",
      fontWeight: "bold",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      ...responsiveButtonStyle,
    }}
  >
    Submit Order
  </button>
</div>

      </>
    )}
  </div>
)}

    </div>
  );
}
