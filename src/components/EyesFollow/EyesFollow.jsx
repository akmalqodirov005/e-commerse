import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, motion } from "framer-motion";
import "./EyesFollow.css";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function EyesFollow() {
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  const leftX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const leftY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  const rightX = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const rightY = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  useEffect(() => {
    const handleMove = (e) => {
      moveEye(leftEyeRef.current, e, leftX, leftY);
      moveEye(rightEyeRef.current, e, rightX, rightY);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const moveEye = (eye, e, x, y) => {
    if (!eye) return;
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
    const maxMove = rect.width * 0.15; // minimalist, biroz kattaroq harakat
    x.set(Math.cos(angle) * maxMove);
    y.set(Math.sin(angle) * maxMove);
  };

  return (
    <div className="container">
      <div className="eyes">
        <div className="eye">
          <motion.div ref={leftEyeRef} className="pupil" style={{ x: leftX, y: leftY }} />
        </div>
        <div className="eye">
          <motion.div ref={rightEyeRef} className="pupil" style={{ x: rightX, y: rightY }} />
        </div>
      </div>

      <div className="cart-info">
        <div className="cart-icon">
          <ShoppingBag size={36} className="icon" />
        </div>
        <h2 className="cart-title">Your cart is empty</h2>
        <p className="cart-text">Add some products to get started</p>
        <Link to="/" className="cart-button">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}