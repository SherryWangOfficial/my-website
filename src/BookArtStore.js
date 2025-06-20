import React, { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import booksData from "./BookArtData";

const globalDiscountEnabled = false;
const globalDiscountPercent = 0;
const discountedTag = ""; // e.g., "Health" or leave "" for all books

function TrapezoidBlock({ imageUrl, width = 3.5, coverAngle = 25}) {
  const meshRef = useRef();
  const groupRef = useRef();
  const currentTexture = useTexture(imageUrl);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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
      position={[0, 0, -1]}
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

function Scene({ books, currentIndex, showRealistic }) {
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
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showRealistic, setShowRealistic] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

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

  // Placeholder: Add to checkout handler
  const handleAddToCheckout = () => {
    if (currentIndex === -1) return;
    alert(`Added "${filteredBooks[currentIndex].title}" to checkout!`);
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
        />
      </Canvas>

      {/* Title and Description */}
      <div
        style={{
          position: "absolute",
          top: 20,
          width: "100%",
          textAlign: "center",
          color: "#333",
          padding: "0 20px",
          boxSizing: "border-box",
          zIndex: 10,
          pointerEvents: "none",
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
          <p style={{ marginTop: 8, fontWeight: "400", fontSize: "1.1rem" }}>
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
          right: 20,
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
              background: "none",
              border: "none",
              fontSize: "3rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              padding: 0,
              color: "#444",
              zIndex: 10,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1)")
            }
            aria-label="Previous Book"
          >
            ←
          </button>

          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              top: "50%",
              right: 20,
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              fontSize: "3rem",
              cursor: "pointer",
              transition: "transform 0.3s ease",
              padding: 0,
              color: "#444",
              zIndex: 10,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(-50%) scale(1)")
            }
            aria-label="Next Book"
          >
            →
          </button>

          {/* Dots */}
          <div
            style={{
              position: "fixed",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "center",
              gap: 12,
              userSelect: "none",
              zIndex: 10,
            }}
          >
            {filteredBooks.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? 18 : 12,
                  height: i === currentIndex ? 18 : 12,
                  borderRadius: "50%",
                  backgroundColor: i === currentIndex ? "#c99b66" : "#ccc",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Add to Checkout Button */}
      <button
        onClick={handleAddToCheckout}
        disabled={currentIndex === -1}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "10px 24px",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: currentIndex === -1 ? "not-allowed" : "pointer",
          borderRadius: 6,
          border: "none",
          backgroundColor: currentIndex === -1 ? "#aaa" : "#c99b66",
          color: "white",
          userSelect: "none",
          zIndex: 10,
          transition: "background-color 0.3s ease",
        }}
      >
        Add to Checkout
      </button>
    </div>
  );
}
