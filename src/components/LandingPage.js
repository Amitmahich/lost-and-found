import emailjs from "@emailjs/browser";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import lostImage from "../assets/lost.png";
import { auth } from "../firebase/config";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const formRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_amit8824",
        "template_iwxbrck",
        formRef.current,
        "8Xog_TGaNd7C2rPWL"
      )
      .then(
        () => {
          toast.success("📩 Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          console.error(error);
          toast.error("❌ Failed to send message!");
        }
      );
  };

  // Prevent flash: render nothing until auth check completes
  if (checkingAuth) return null;

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Lost and Found</div>
        <div className="auth-link">
          <Link to="/signup">Sign-up</Link>
          <Link to="/signin">Log-in</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="content">
        <div className="text-section">
          <h1 style={{ textDecoration: "underline" }}>LOST AND FOUND</h1>
          <p>LOST IT. LIST IT. FIND IT.</p>
        </div>
        <div className="image-section">
          <img src={lostImage} alt="Lost" />
        </div>
      </div>

      {/* Inspiration Section */}
      <div className="inspiration-section">
        <div className="inspiration-image">
          <img src={require("../assets/inspiration.png")} alt="Inspiration" />
        </div>
        <div className="inspiration-text">
          <h2>My Project Inspiration</h2>
          <p>
            This project is inspired by the real-world challenges of finding
            lost items in large communities like colleges, offices, or public
            places. The goal is to connect people who’ve lost something with
            those who’ve found it — instantly and easily.
          </p>
          <div className="get-started-wrapper">
            <button
              className="get-started-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2 className="how-heading">HOW IT WORKS ?</h2>
        <div className="steps-container">
          <div className="step-card">
            <img src={require("../assets/step-1.png")} alt="Create Account" />
            <h3>Create an Account</h3>
            <p>Initially, you have to create an account to get started.</p>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign up
            </button>
          </div>
          <div className="step-card">
            <img src={require("../assets/step-2.png")} alt="List Item" />
            <h3>List Lost/Found Item</h3>
            <p>
              You can list the items you’ve lost or found to help connect with
              others.
            </p>
          </div>
          <div className="step-card">
            <img src={require("../assets/step-3.png")} alt="Get Notified" />
            <h3>Get Notified</h3>
            <p>
              Receive notifications when someone finds or matches your item.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-left">
          <h2>CONTACT FORM</h2>
          <p>
            Have a question or suggestion? We’d love to hear from you. Fill out
            the form and we’ll get back to you shortly.
          </p>
        </div>

        <div className="contact-right">
          <form className="contact-form" ref={formRef} onSubmit={sendEmail}>
            <input type="text" name="name" placeholder="Your Name" required />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              required
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="social-icons">
          <a
            href="https://github.com/Amitmahich"
            target="github"
            rel="noreferrer"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://instagram.com/amit__4860"
            target="instagram"
            rel="noreferrer"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/amit-mahich-a580a2308/"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedin size={22} />
          </a>
        </div>
        <p>
          Created with <span className="heart">❤️</span> by{" "}
          <strong>Amit Kumar</strong>
        </p>
        <p>© {new Date().getFullYear()} Lost and Found. All rights reserved.</p>
      </footer>
    </div>
  );
}
