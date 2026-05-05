import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 128,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 89,
    badge: "New"
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 245,
    badge: "Top Rated"
  },
  {
    id: 4,
    name: "Leather Bag",
    price: 3499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 67,
    badge: ""
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 2499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 156,
    badge: "Best Seller"
  },
  {
    id: 6,
    name: "Yoga Mat",
    price: 899,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1601925228008-52b5c9a66c7a?w=300&h=300&fit=crop",
    rating: 4.4,
    reviews: 203,
    badge: ""
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 1499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop",
    rating: 4.1,
    reviews: 91,
    badge: "Sale"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 1799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    rating: 4.5,
    reviews: 178,
    badge: ""
  },
  {
    id: 9,
    name: "Face Cream",
    price: 699,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop",
    rating: 4.3,
    reviews: 312,
    badge: "Popular"
  },
  {
    id: 10,
    name: "Gaming Mouse",
    price: 2299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 143,
    badge: "New"
  },
  {
    id: 11,
    name: "Water Bottle",
    price: 499,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 421,
    badge: "Top Rated"
  },
  {
    id: 12,
    name: "Desk Lamp",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop",
    rating: 4.2,
    reviews: 88,
    badge: ""
  },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports", "Beauty"];

const EcommerceHome = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addedItems, setAddedItems] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setAddedItems({ ...addedItems, [product.id]: true });
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, change) => {
    setCart(cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const handleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: `ORD${Date.now()}`,
      items: [...cart],
      total: cartTotal,
      status: "Confirmed",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setShowCart(false);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 3000);
  };

  const handleSupportDesk = () => {
    const role = localStorage.getItem("userRole");
    if (role === "agent") {
      navigate("/agent/dashboard");
    } else {
      navigate("/customer/questions");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Top Announcement Bar */}
      <div style={{
        background: "linear-gradient(135deg, #e53e3e, #c53030)",
        color: "white",
        padding: "0.5rem 2rem",
        fontSize: "0.82rem",
        textAlign: "center",
        fontWeight: 500,
      }}>
        🎉 Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code <strong>FIRST10</strong> for 10% off! &nbsp;|&nbsp; 🔥 Flash Sale ends today!
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: "white",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gap: "1rem",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          <div style={{
            width: "42px", height: "42px",
            background: "linear-gradient(135deg, #e53e3e, #c53030)",
            borderRadius: "12px",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "1.3rem",
            boxShadow: "0 4px 12px rgba(229,62,62,0.3)",
          }}>🛒</div>
          <div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: "1.3rem",
              color: "#1a1a2e", lineHeight: 1,
            }}>ShopEasy</p>
            <p style={{ fontSize: "0.65rem", color: "#999" }}>Your one stop shop</p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: "450px" }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "1rem",
              top: "50%", transform: "translateY(-50%)",
              fontSize: "1rem", color: "#999",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: "25px",
                border: "2px solid #f0f0f0",
                outline: "none",
                fontSize: "0.9rem",
                fontFamily: "'DM Sans', sans-serif",
                background: "#f8f9fa",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={e => {
                e.target.style.borderColor = "#e53e3e";
                e.target.style.background = "white";
              }}
              onBlur={e => {
                e.target.style.borderColor = "#f0f0f0";
                e.target.style.background = "#f8f9fa";
              }}
            />
          </div>
        </div>

        {/* Nav Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>

          {/* Wishlist */}
          <button style={{
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            border: "2px solid #f0f0f0",
            background: "white",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontFamily: "'DM Sans', sans-serif",
            color: "#333",
            display: "flex", alignItems: "center", gap: "0.4rem",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#e53e3e"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#f0f0f0"}
          >
            ❤️ {wishlist.length > 0 && `(${wishlist.length})`}
          </button>

          {/* Orders */}
          <button
            onClick={() => { setShowOrders(true); setShowCart(false); }}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "10px",
              border: "2px solid #f0f0f0",
              background: "white",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              color: "#333",
              display: "flex", alignItems: "center", gap: "0.4rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#e53e3e"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#f0f0f0"}
          >
            📦 Orders
            {orders.length > 0 && (
              <span style={{
                background: "#e53e3e", color: "white",
                borderRadius: "50%", width: "18px", height: "18px",
                fontSize: "0.7rem", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontWeight: 700,
              }}>{orders.length}</span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => { setShowCart(true); setShowOrders(false); }}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #e53e3e, #c53030)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem",
              boxShadow: "0 4px 15px rgba(229,62,62,0.35)",
              transition: "all 0.2s",
            }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background: "white", color: "#e53e3e",
                borderRadius: "50%", width: "22px", height: "22px",
                fontSize: "0.75rem", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontWeight: 800,
              }}>{cartCount}</span>
            )}
          </button>

          {/* Support Desk */}
          <button
            onClick={handleSupportDesk}
            style={{
              padding: "0.65rem 1.25rem",
              borderRadius: "10px",
              border: "2px solid #1a1a2e",
              background: "#1a1a2e",
              color: "white",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#1a1a2e";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#1a1a2e";
              e.currentTarget.style.color = "white";
            }}
          >
            💬 Support
          </button>
        </div>
      </nav>

      {/* Order Success Toast */}
      {showOrderSuccess && (
        <div style={{
          position: "fixed", top: "90px", right: "2rem",
          background: "#38a169", color: "white",
          padding: "1rem 1.5rem", borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          zIndex: 1000,
          display: "flex", alignItems: "center", gap: "0.75rem",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
        }}>
          ✅ Order placed successfully! We will deliver soon.
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
          <div
            onClick={() => setShowCart(false)}
            style={{ flex: 1, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          />
          <div style={{
            width: "420px",
            background: "white",
            height: "100vh",
            overflowY: "auto",
            padding: "1.5rem",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
            display: "flex", flexDirection: "column",
          }}>

            {/* Cart Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", color: "#1a1a2e" }}>
                🛒 My Cart {cartCount > 0 && `(${cartCount})`}
              </h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  border: "none", background: "#f0f0f0",
                  borderRadius: "50%", width: "34px", height: "34px",
                  cursor: "pointer", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#666", flex: 1 }}>
                <p style={{ fontSize: "4rem" }}>🛒</p>
                <p style={{ marginTop: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>Your cart is empty</p>
                <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem" }}>
                  Add items to get started
                </p>
                <button
                  onClick={() => setShowCart(false)}
                  style={{
                    marginTop: "1.5rem", padding: "0.75rem 2rem",
                    background: "linear-gradient(135deg, #e53e3e, #c53030)",
                    color: "white", border: "none", borderRadius: "10px",
                    cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  }}
                >Continue Shopping</button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div style={{ flex: 1 }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      display: "flex", alignItems: "center",
                      gap: "1rem", padding: "1rem 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}>
                      {/* Item Image */}
                      <div style={{
                        width: "70px", height: "70px",
                        borderRadius: "12px", overflow: "hidden",
                        flexShrink: 0, background: "#f8f9fa",
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => e.target.style.display = "none"}
                        />
                      </div>

                      {/* Item Info */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1a1a2e" }}>
                          {item.name}
                        </p>
                        <p style={{
                          color: "#e53e3e", fontWeight: 700,
                          marginTop: "0.2rem", fontSize: "0.95rem",
                        }}>
                          ₹{item.price.toLocaleString()}
                        </p>

                        {/* Quantity Controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            style={{
                              width: "26px", height: "26px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "50%", cursor: "pointer",
                              background: "white", fontSize: "1rem",
                              display: "flex", alignItems: "center",
                              justifyContent: "center", color: "#333",
                            }}
                          >−</button>
                          <span style={{
                            fontWeight: 700, minWidth: "24px",
                            textAlign: "center", fontSize: "0.95rem",
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            style={{
                              width: "26px", height: "26px",
                              border: "1px solid #e0e0e0",
                              borderRadius: "50%", cursor: "pointer",
                              background: "white", fontSize: "1rem",
                              display: "flex", alignItems: "center",
                              justifyContent: "center", color: "#333",
                            }}
                          >+</button>
                        </div>
                      </div>

                      {/* Item Total + Remove */}
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.95rem" }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          style={{
                            border: "none", background: "none",
                            color: "#e53e3e", cursor: "pointer",
                            fontSize: "0.8rem", marginTop: "0.5rem",
                            padding: 0,
                          }}
                        >🗑️ Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div style={{ marginTop: "1rem" }}>
                  <div style={{
                    background: "#f8f9fa", borderRadius: "12px",
                    padding: "1rem", marginBottom: "1rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#666", fontSize: "0.9rem" }}>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#666", fontSize: "0.9rem" }}>Shipping</span>
                      <span style={{
                        color: cartTotal > 999 ? "#38a169" : "#333",
                        fontWeight: 600,
                      }}>
                        {cartTotal > 999 ? "🎉 FREE" : "₹99"}
                      </span>
                    </div>
                    {cartTotal <= 999 && (
                      <p style={{ fontSize: "0.75rem", color: "#e53e3e", marginBottom: "0.5rem" }}>
                        Add ₹{(999 - cartTotal).toLocaleString()} more for free shipping!
                      </p>
                    )}
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontWeight: 800, fontSize: "1.1rem",
                      borderTop: "1px solid #e0e0e0",
                      paddingTop: "0.75rem", marginTop: "0.5rem",
                    }}>
                      <span>Total</span>
                      <span style={{ color: "#e53e3e" }}>
                        ₹{(cartTotal + (cartTotal > 999 ? 0 : 99)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    style={{
                      width: "100%", padding: "1rem",
                      background: "linear-gradient(135deg, #e53e3e, #c53030)",
                      color: "white", border: "none",
                      borderRadius: "12px", cursor: "pointer",
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      fontSize: "1rem",
                      boxShadow: "0 4px 15px rgba(229,62,62,0.35)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                  >
                    🛒 Place Order → ₹{(cartTotal + (cartTotal > 999 ? 0 : 99)).toLocaleString()}
                  </button>

                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      width: "100%", padding: "0.75rem",
                      background: "transparent", border: "2px solid #f0f0f0",
                      borderRadius: "12px", cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem", color: "#666",
                      marginTop: "0.75rem",
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Orders Sidebar */}
      {showOrders && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex" }}>
          <div
            onClick={() => setShowOrders(false)}
            style={{ flex: 1, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          />
          <div style={{
            width: "420px", background: "white",
            height: "100vh", overflowY: "auto",
            padding: "1.5rem",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", color: "#1a1a2e" }}>
                📦 My Orders
              </h2>
              <button
                onClick={() => setShowOrders(false)}
                style={{
                  border: "none", background: "#f0f0f0",
                  borderRadius: "50%", width: "34px", height: "34px",
                  cursor: "pointer", fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "#666" }}>
                <p style={{ fontSize: "4rem" }}>📦</p>
                <p style={{ marginTop: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>No orders yet</p>
                <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.5rem" }}>
                  Place your first order!
                </p>
                <button
                  onClick={() => setShowOrders(false)}
                  style={{
                    marginTop: "1.5rem", padding: "0.75rem 2rem",
                    background: "linear-gradient(135deg, #e53e3e, #c53030)",
                    color: "white", border: "none", borderRadius: "10px",
                    cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  }}
                >Start Shopping</button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={{
                  background: "#f8f9fa", borderRadius: "16px",
                  padding: "1.25rem", marginBottom: "1rem",
                  border: "1px solid #e0e0e0",
                }}>
                  {/* Order Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>
                        {order.id}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.2rem" }}>
                        {order.date} at {order.time}
                      </p>
                    </div>
                    <span style={{
                      background: "#c6f6d5", color: "#276749",
                      padding: "0.3rem 0.75rem", borderRadius: "20px",
                      fontSize: "0.75rem", fontWeight: 700,
                      height: "fit-content",
                    }}>
                      ✅ {order.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  {order.items.map((item) => (
                    <div key={item.id} style={{
                      display: "flex", alignItems: "center",
                      gap: "0.75rem", marginBottom: "0.75rem",
                      background: "white", borderRadius: "10px",
                      padding: "0.75rem",
                    }}>
                      <div style={{
                        width: "45px", height: "45px",
                        borderRadius: "8px", overflow: "hidden",
                        flexShrink: 0, background: "#f0f0f0",
                      }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => e.target.style.display = "none"}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a2e" }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#666" }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#e53e3e" }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}

                  {/* Order Total */}
                  <div style={{
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: "0.75rem", marginTop: "0.25rem",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ fontWeight: 700, color: "#1a1a2e" }}>Total Paid</span>
                    <span style={{ fontWeight: 800, color: "#e53e3e", fontSize: "1.05rem" }}>
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>

                  {/* Delivery Status */}
                  <div style={{
                    marginTop: "0.75rem", padding: "0.75rem",
                    background: "#ebf8ff", borderRadius: "10px",
                    border: "1px solid #bee3f8",
                  }}>
                    <p style={{ fontSize: "0.78rem", color: "#2b6cb0", fontWeight: 600 }}>
                      🚚 Expected delivery in 3-5 business days
                    </p>
                  </div>

                  {/* Support Button */}
                  <button
                    onClick={handleSupportDesk}
                    style={{
                      width: "100%", marginTop: "0.75rem",
                      padding: "0.6rem", border: "2px solid #1a1a2e",
                      background: "white", borderRadius: "10px",
                      cursor: "pointer", fontSize: "0.82rem",
                      fontFamily: "'Syne', sans-serif", fontWeight: 700,
                      color: "#1a1a2e",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", gap: "0.5rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#1a1a2e";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#1a1a2e";
                    }}
                  >
                    💬 Need help with this order?
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        {/* Hero Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          borderRadius: "24px",
          padding: "3rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 60px rgba(26,26,46,0.3)",
        }}>
          {/* Background decoration */}
          <div style={{
            position: "absolute", right: "-50px", top: "-50px",
            width: "300px", height: "300px",
            background: "rgba(229,62,62,0.1)",
            borderRadius: "50%",
          }} />
          <div style={{
            position: "absolute", right: "100px", bottom: "-80px",
            width: "200px", height: "200px",
            background: "rgba(229,62,62,0.08)",
            borderRadius: "50%",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(229,62,62,0.2)",
              padding: "0.3rem 0.9rem", borderRadius: "20px",
              marginBottom: "1rem",
            }}>
              <span style={{ color: "#fc8181", fontSize: "0.8rem", fontWeight: 700 }}>
                🔥 Limited Time Offer
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              color: "white", fontSize: "2.8rem",
              fontWeight: 800, lineHeight: 1.2,
              marginBottom: "1rem",
            }}>
              Shop Smart,<br />
              <span style={{ color: "#fc8181" }}>Save Big!</span> 🛍️
            </h1>
            <p style={{
              color: "rgba(255,255,255,0.7)",
              marginBottom: "2rem", fontSize: "1rem",
            }}>
              Up to 50% off on top products this week only
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button style={{
                padding: "0.9rem 2rem",
                background: "linear-gradient(135deg, #e53e3e, #c53030)",
                color: "white", border: "none",
                borderRadius: "12px", cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: "1rem",
                boxShadow: "0 4px 20px rgba(229,62,62,0.4)",
                transition: "all 0.2s",
              }}>
                Shop Now →
              </button>
              <button style={{
                padding: "0.9rem 2rem",
                background: "rgba(255,255,255,0.1)",
                color: "white", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500, fontSize: "1rem",
                transition: "all 0.2s",
              }}>
                View Deals
              </button>
            </div>
          </div>

          <div style={{
            fontSize: "10rem", opacity: 0.15,
            position: "absolute", right: "2rem",
            userSelect: "none",
          }}>🛒</div>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem", marginBottom: "2.5rem",
        }}>
          {[
            { icon: "🚚", label: "Free Delivery", sub: "On orders above ₹999" },
            { icon: "↩️", label: "Easy Returns", sub: "30 day return policy" },
            { icon: "🔒", label: "Secure Payment", sub: "100% safe checkout" },
            { icon: "🎧", label: "24/7 Support", sub: "Always here to help" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "white", borderRadius: "14px",
              padding: "1.25rem", textAlign: "center",
              boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
              border: "1px solid #f0f0f0",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 15px rgba(0,0,0,0.05)"}
            >
              <p style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>{stat.icon}</p>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e",
              }}>{stat.label}</p>
              <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "0.2rem" }}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.4rem", color: "#1a1a2e",
            marginBottom: "1rem",
          }}>
            Shop by Category
          </h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.65rem 1.5rem",
                  borderRadius: "25px",
                  border: selectedCategory === cat ? "none" : "2px solid #e0e0e0",
                  background: selectedCategory === cat
                    ? "linear-gradient(135deg, #e53e3e, #c53030)"
                    : "white",
                  color: selectedCategory === cat ? "white" : "#333",
                  cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600, fontSize: "0.875rem",
                  transition: "all 0.2s",
                  boxShadow: selectedCategory === cat
                    ? "0 4px 15px rgba(229,62,62,0.35)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                {cat === "All" && "🛍️ "}
                {cat === "Electronics" && "⚡ "}
                {cat === "Fashion" && "👗 "}
                {cat === "Home" && "🏠 "}
                {cat === "Sports" && "⚽ "}
                {cat === "Beauty" && "💄 "}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "1.25rem",
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.3rem", color: "#1a1a2e",
          }}>
            {selectedCategory === "All" ? "All Products" : selectedCategory}
            <span style={{ color: "#999", fontWeight: 400, fontSize: "1rem" }}>
              {" "}({filteredProducts.length} items)
            </span>
          </h2>
          {search && (
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Results for "{search}"
            </p>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
            <p style={{ fontSize: "3rem" }}>🔍</p>
            <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>No products found</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              style={{
                marginTop: "1rem", padding: "0.7rem 1.5rem",
                background: "#e53e3e", color: "white",
                border: "none", borderRadius: "10px", cursor: "pointer",
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
              }}
            >Clear Filters</button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 2px 15px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  border: "1px solid #f0f0f0",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 15px rgba(0,0,0,0.06)";
                }}
              >
                {/* Product Image */}
                <div style={{
                  position: "relative",
                  height: "200px",
                  overflow: "hidden",
                  background: "#f8f9fa",
                }}>
                  {/* Badge */}
                  {product.badge && (
                    <span style={{
                      position: "absolute", top: "0.75rem", left: "0.75rem",
                      background: product.badge === "Sale"
                        ? "#e53e3e"
                        : product.badge === "New"
                          ? "#3182ce"
                          : product.badge === "Top Rated"
                            ? "#d69e2e"
                            : product.badge === "Popular"
                              ? "#805ad5"
                              : "#38a169",
                      color: "white",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      zIndex: 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>
                      {product.badge}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(product.id)}
                    style={{
                      position: "absolute", top: "0.75rem", right: "0.75rem",
                      width: "34px", height: "34px",
                      background: "white", border: "none",
                      borderRadius: "50%", cursor: "pointer",
                      fontSize: "1rem", zIndex: 1,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    {wishlist.includes(product.id) ? "❤️" : "🤍"}
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    onError={e => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ padding: "1.25rem" }}>
                  <p style={{
                    fontSize: "0.72rem", color: "#e53e3e",
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    fontWeight: 700, marginBottom: "0.3rem",
                  }}>
                    {product.category}
                  </p>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "1rem", fontWeight: 700,
                    color: "#1a1a2e", marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}>
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "0.4rem", marginBottom: "1rem",
                  }}>
                    <div style={{ display: "flex", gap: "1px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{
                          color: star <= Math.floor(product.rating) ? "#f6ad55" : "#e0e0e0",
                          fontSize: "0.8rem",
                        }}>★</span>
                      ))}
                    </div>
                    <span style={{ color: "#f6ad55", fontSize: "0.8rem", fontWeight: 700 }}>
                      {product.rating}
                    </span>
                    <span style={{ color: "#999", fontSize: "0.75rem" }}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price + Add to Cart */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "1.25rem", fontWeight: 800,
                        color: "#e53e3e", lineHeight: 1,
                      }}>
                        ₹{product.price.toLocaleString()}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#bbb", marginTop: "0.2rem" }}>
                        <s>₹{Math.floor(product.price * 1.3).toLocaleString()}</s>
                        <span style={{ color: "#38a169", marginLeft: "0.3rem" }}>23% off</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        padding: "0.65rem 1.1rem",
                        background: addedItems[product.id]
                          ? "linear-gradient(135deg, #38a169, #276749)"
                          : "linear-gradient(135deg, #e53e3e, #c53030)",
                        color: "white", border: "none",
                        borderRadius: "10px", cursor: "pointer",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700, fontSize: "0.82rem",
                        transition: "all 0.3s",
                        boxShadow: addedItems[product.id]
                          ? "0 4px 12px rgba(56,161,105,0.35)"
                          : "0 4px 12px rgba(229,62,62,0.35)",
                        minWidth: "90px",
                      }}
                    >
                      {addedItems[product.id] ? "✓ Added!" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: "#1a1a2e",
        color: "white",
        padding: "3rem 2rem 2rem",
        marginTop: "4rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Footer Top */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "2rem", marginBottom: "2rem",
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{
                  width: "38px", height: "38px",
                  background: "linear-gradient(135deg, #e53e3e, #c53030)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.2rem",
                }}>🛒</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>
                  ShopEasy
                </p>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                Your trusted online shopping destination with the best deals and fast delivery.
              </p>

              {/* Support CTA */}
              <button
                onClick={handleSupportDesk}
                style={{
                  marginTop: "1rem",
                  padding: "0.6rem 1.2rem",
                  background: "linear-gradient(135deg, #e53e3e, #c53030)",
                  color: "white", border: "none",
                  borderRadius: "8px", cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: "0.85rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}
              >
                💬 Support Desk
              </button>
            </div>

            {/* Quick Links */}
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                Quick Links
              </p>
              {["Home", "Products", "Categories", "Deals", "About Us"].map((link) => (
                <p key={link} style={{
                  color: "rgba(255,255,255,0.5)", fontSize: "0.85rem",
                  marginBottom: "0.5rem", cursor: "pointer",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.target.style.color = "white"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{link}</p>
              ))}
            </div>

            {/* Customer Service */}
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                Customer Service
              </p>
              {["My Orders", "Track Order", "Returns", "FAQ", "Contact Us"].map((link) => (
                <p key={link} style={{
                  color: "rgba(255,255,255,0.5)", fontSize: "0.85rem",
                  marginBottom: "0.5rem", cursor: "pointer",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.target.style.color = "white"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{link}</p>
              ))}
            </div>

            {/* Contact */}
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: "1rem" }}>
                Contact Us
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                📧 support@shopeasy.com
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                📞 1800-123-4567
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                🕐 Mon-Sun 9am-9pm
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["📘", "📷", "🐦", "▶️"].map((icon) => (
                  <div key={icon} style={{
                    width: "34px", height: "34px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer",
                    fontSize: "1rem", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.2)"}
                    onMouseLeave={e => e.target.style.background = "rgba(255,255,255,0.1)"}
                  >{icon}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "1.5rem",
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
          }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
              © 2025 ShopEasy. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {["Visa", "Mastercard", "UPI", "PayTM"].map((pay) => (
                <span key={pay} style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.6)",
                }}>
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceHome;
