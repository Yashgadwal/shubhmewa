"use client";

import React, { useState, useEffect } from "react";
import "./best-quality.css";

export default function BestQualityClient() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    if (!modalProduct) {
      document.body.classList.remove("no-scroll");
    }
  };

  const toggleMenu = () => {
    if (isMobileMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openModal = (productName: string) => {
    setModalProduct(productName);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setModalProduct(null);
    if (!isMobileMenuOpen) {
      document.body.classList.remove("no-scroll");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, modalProduct]);

  return (
    <div className="best-quality-page">
{/*  STICKY NAVBAR  */}
  <nav className={`navbar ${isScrolled ? "scrolled" : ""}`} id="mainNavbar">
    <div className="container navbar-inner">
      {/*  Logo  */}
      <a href="#home" className="brand-logo" aria-label="M/S Best Quality Dryfruits &amp; Masala House">
        <span className="brand-name">Best Quality</span>
        <span className="brand-sub">Dryfruits &amp; Masalas • Ujjain</span>
      </a>

      {/*  Desktop Links  */}
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#why-us">Why Us</a></li>
        <li><a href="#offers">Offers</a></li>
        <li><a href="#reviews">Reviews</a></li>
        <li><a href="#visit-us">Visit Us</a></li>
      </ul>

      {/*  Nav Actions (Call & Hamburger on Mobile)  */}
      <div className="nav-actions">
        <a href="tel:+918839315887" className="nav-call-btn" aria-label="Call Store Now">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span className="call-label">Call Now</span>
        </a>

        <button
          className={`hamburger-btn ${isMobileMenuOpen ? "active" : ""}`}
          id="mobileMenuBtn"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobileMenu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>

  {/*  Mobile Backdrop Overlay  */}
  <div className={`mobile-menu-backdrop ${isMobileMenuOpen ? "active" : ""}`} id="mobileMenuBackdrop" onClick={closeMenu}></div>

  {/*  Mobile Drawer Menu  */}
  <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`} id="mobileMenu" aria-hidden={!isMobileMenuOpen}>
    <div className="mobile-menu-header-chip">
      <span>📍</span>
      <span>55, Fawara Chowk, near Doulatganj, Ujjain</span>
    </div>
    
    <a href="#home" className="mobile-link" onClick={closeMenu}>
      <span>Home</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#products" className="mobile-link" onClick={closeMenu}>
      <span>Products &amp; Categories</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#why-us" className="mobile-link" onClick={closeMenu}>
      <span>Why Choose Us</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#offers" className="mobile-link" onClick={closeMenu}>
      <span>In-Store Offers</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#gifting" className="mobile-link" onClick={closeMenu}>
      <span>Festive Gifting</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#reviews" className="mobile-link" onClick={closeMenu}>
      <span>Customer Reviews</span>
      <span className="mobile-link-arrow">→</span>
    </a>
    <a href="#visit-us" className="mobile-link" onClick={closeMenu}>
      <span>Visit Store &amp; Hours</span>
      <span className="mobile-link-arrow">→</span>
    </a>

    <div className="mobile-menu-cta">
      <a href="tel:+918839315887" className="btn btn-primary" style={{ width: "100%" }}>
        📞 Call +91 88393 15887
      </a>
      <a href="https://wa.me/918839315887?text=Hello%20M/S%20Best%20Quality,%20I%20would%20like%20to%20enquire%20about%20your%20products." target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: "#25D366", color: "#FFFFFF", width: "100%" }}>
        💬 Enquire on WhatsApp
      </a>
      <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: "100%" }}>
        📍 Get Directions on Google Maps
      </a>
    </div>
  </div>

  {/*  HERO SECTION  */}
  <section className="hero-section" id="home">
    <div className="container">
      <div className="hero-grid">
        {/*  Hero Left Content  */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>📍</span> Ujjain's Trusted Dry Fruit &amp; Masala Store
          </div>
          <h1 className="hero-headline">
            Premium Quality Dry Fruits, Masalas &amp; Everyday Essentials
          </h1>
          <p className="hero-subtext">
            Fresh products, trusted quality and great value — available at M/S Best Quality Dryfruits &amp; Masala House, Ujjain. Serving families and festive gifting with care at Fawara Chowk.
          </p>
          <div className="hero-cta-group">
            <a href="tel:+918839315887" className="btn btn-primary" style={{ padding: "12px 24px" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>Call Now</span>
            </a>
            <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: "12px 22px" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Get Directions</span>
            </a>
          </div>
          {/*  Trust Row  */}
          <div className="hero-trust-row">
            <div className="trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Quality Products</span>
            </div>
            <div className="trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Great Value</span>
            </div>
            <div className="trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Local Ujjain Store</span>
            </div>
            <div className="trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Gift Options Available</span>
            </div>
          </div>
        </div>

        {/*  Hero Right Visual Collage  */}
        <div className="hero-visual-wrapper">
          <div className="hero-visual-grid">
            <div className="hero-img-card card-large">
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" alt="Authentic Indian spices and masala variety at Best Quality Ujjain" loading="eager" />
              <span className="img-tag">Aromatic Masalas</span>
            </div>
            <div className="hero-img-card card-medium">
              <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80" alt="Crisp premium dry fruits almonds and nuts" loading="eager" />
              <span className="img-tag">Select Dry Fruits</span>
            </div>
            <div className="hero-img-card card-small-1">
              <img src="https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80" alt="Fresh whole cashews kaju" loading="lazy" />
              <span className="img-tag">Premium Kaju</span>
            </div>
            <div className="hero-img-card card-small-2">
              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" alt="Dry fruit festive gifting hamper" loading="lazy" />
              <span className="img-tag">Gift Hampers</span>
            </div>
            <div className="hero-img-card card-small-3">
              <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80" alt="Crisp pistachios pista in bowl" loading="lazy" />
              <span className="img-tag">Royal Pista</span>
            </div>
          </div>

          {/*  Verified Floating Badge  */}
          <div className="hero-badge-float">
            <div className="rating-number">4.9</div>
            <div>
              <div className="rating-stars">★★★★★</div>
              <div className="rating-label">Google Rating (10 Reviews) • Fawara Chowk</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  OFFER STRIP  */}
  <section className="offer-strip-section" id="offers">
    <div className="container">
      <div className="offer-banner-card">
        <div className="offer-content-left">
          <div className="offer-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          </div>
          <div>
            <h2 className="offer-title">Special Offers Available In-Store</h2>
            <p className="offer-subtext">Ask us about today's special offers on dry fruits, spices and gifting bundles.</p>
          </div>
        </div>
        <div>
          <a href="tel:+918839315887" className="btn btn-primary btn-sm">
            <span>📞 Call &amp; Enquire</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  {/*  PRODUCTS / CATEGORIES (6 CATEGORIES)  */}
  <section className="categories-section" id="products">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow">Our Range</div>
        <h2 className="section-title">Everything You Need, Under One Roof</h2>
        <p className="section-desc">
          Explore our range of dry fruits, spices, groceries and gifting essentials — carefully sourced for purity, taste, and freshness.
        </p>
      </div>

      <div className="categories-grid">
        {/*  01 Dry Fruits  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">01 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80" alt="Premium dry fruits almonds cashews raisins dates" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Dry Fruits</h3>
            <p className="category-items">
              Almonds • Cashews • Pistachios • Walnuts • Raisins • Dates
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>

        {/*  02 Masalas & Spices  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">02 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" alt="Indian whole spices and ground masalas in bowls" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Masalas &amp; Spices</h3>
            <p className="category-items">
              Whole spices • Ground spices • Blended masalas • Everyday cooking essentials
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>

        {/*  03 Grocery Essentials  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">03 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80" alt="Grocery and household food cooking essentials" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Grocery Essentials</h3>
            <p className="category-items">
              Selected everyday grocery and household food products for your family's daily cooking needs.
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>

        {/*  04 Gift Hampers  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">04 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" alt="Festive dry fruit gift hampers and celebration packs" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Gift Hampers</h3>
            <p className="category-items">
              Premium dry-fruit gifting options for festivals, celebrations and special occasions.
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>

        {/*  05 Snacks & Specialties  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">05 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=800&q=80" alt="Healthy snacks nuts and select packaged foods" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Snacks &amp; Specialties</h3>
            <p className="category-items">
              Tasty snack options and selected food products chosen for quality and wholesome freshness.
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>

        {/*  06 Festival Specials  */}
        <div className="category-card">
          <div className="category-img-box">
            <span className="category-number">06 — CATEGORY</span>
            <img src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80" alt="Festival specials dates nuts and celebratory offerings" loading="lazy" />
          </div>
          <div className="category-body">
            <h3 className="category-name">Festival Specials</h3>
            <p className="category-items">
              Seasonal products, festive gifting and special offers during Diwali, Rakhi, and holy Ujjain festivities.
            </p>
            <a href="tel:+918839315887" className="category-footer-link">
              <span>Enquire in-store</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  FEATURED PRODUCTS SHOWCASE (POPULAR CHOICES)  */}
  <section className="featured-section">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow gold">Curated Selection</div>
        <h2 className="section-title">Popular Choices</h2>
        <p className="section-desc">
          Customer favorites loved for consistent taste, texture, and fragrance. Connect with our Fawara Chowk store to check current daily batches.
        </p>
      </div>

      <div className="featured-grid">
        {/*  Badam  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Select Grade</span>
            <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80" alt="Badam Almonds" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Badam (Almonds)</h3>
            <p className="product-desc">Carefully sorted, crunchy almonds rich in wholesome nutrition and natural sweetness.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Badam (Almonds)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Kaju  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Whole White</span>
            <img src="https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80" alt="Kaju Cashews" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Kaju (Cashews)</h3>
            <p className="product-desc">Whole, creamy cashews selected for traditional sweets, curries, and daily family snacking.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Kaju (Cashews)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Pista  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Nutty Aroma</span>
            <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80" alt="Pista Pistachios" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Pista (Pistachios)</h3>
            <p className="product-desc">Premium roasted and salted or natural pistachios with signature crunch and royal taste.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Pista (Pistachios)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Akhrot  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Fresh Kernels</span>
            <img src="https://images.unsplash.com/photo-1568283096533-078a24930eb8?auto=format&fit=crop&w=800&q=80" alt="Akhrot Walnuts" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Akhrot (Walnuts)</h3>
            <p className="product-desc">Fresh, tender walnut halves packed with natural omega nutrients and clean earthy flavor.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Akhrot (Walnuts)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Kishmish  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Sweet &amp; Juicy</span>
            <img src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80" alt="Kishmish Raisins" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Kishmish (Raisins)</h3>
            <p className="product-desc">Sweet golden and long green raisins, perfect for festive kheer, halwa, and everyday prasad.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Kishmish (Raisins)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Khajoor  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Soft Dates</span>
            <img src="https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80" alt="Khajoor Dates" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Khajoor (Dates)</h3>
            <p className="product-desc">Selected premium dates offering natural energy, caramel richness, and gentle softness.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Khajoor (Dates)")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Premium Masalas  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Whole &amp; Ground</span>
            <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80" alt="Aromatic Khade & Pise Masale" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Premium Masalas</h3>
            <p className="product-desc">Traditional khade masale and finely milled fragrant spices to elevate every Malwi delicacy.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Premium Masalas")}>
              Enquire Now
            </button>
          </div>
        </div>

        {/*  Gift Hampers  */}
        <div className="product-card">
          <div className="product-img-box">
            <span className="product-badge">Festive Pack</span>
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" alt="Dry fruit celebration gift hampers" loading="lazy" />
          </div>
          <div className="product-body">
            <h3 className="product-title">Gift Hampers</h3>
            <p className="product-desc">Auspicious dry fruit boxes and celebratory hampers designed for weddings and festivals.</p>
            <div className="product-price-row">
              <span className="price-text">Price on Enquiry</span>
            </div>
            <button className="btn btn-outline btn-sm open-modal-btn" onClick={() => openModal("Gift Hampers")}>
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  WHY CHOOSE US  */}
  <section className="why-us-section" id="why-us">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow">Local Commitment</div>
        <h2 className="section-title">Why Ujjain Customers Choose Best Quality</h2>
        <p className="section-desc">
          Rooted in Fawara Chowk, we are dedicated to bringing reliable quality, friendly service, and everyday value to your home.
        </p>
      </div>

      <div className="why-grid">
        {/*  1 Quality First  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
          </div>
          <h3 className="why-card-title">Quality First</h3>
          <p className="why-card-desc">
            Carefully selected products with focus on freshness and quality, ensuring dependable taste in every bite.
          </p>
        </div>

        {/*  2 Wide Selection  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <h3 className="why-card-title">Wide Selection</h3>
          <p className="why-card-desc">
            Dry fruits, masalas, groceries and gifting options together in one convenient store for easy shopping.
          </p>
        </div>

        {/*  3 Great Value  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <h3 className="why-card-title">Great Value</h3>
          <p className="why-card-desc">
            Quality products offered at competitive local-store pricing, giving families great value on every visit.
          </p>
        </div>

        {/*  4 Local & Trusted  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3 className="why-card-title">Local &amp; Trusted</h3>
          <p className="why-card-desc">
            Proudly serving customers across Ujjain from our established shopfront at Fawara Chowk, near Doulatganj.
          </p>
        </div>

        {/*  5 Personal Service  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h3 className="why-card-title">Personal Service</h3>
          <p className="why-card-desc">
            Warm, helpful in-store assistance to guide you in choosing the right dry fruits, spices, and festival gift packs.
          </p>
        </div>

        {/*  6 Convenient Location  */}
        <div className="why-card">
          <div className="why-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <h3 className="why-card-title">Convenient Location</h3>
          <p className="why-card-desc">
            Easy to find at 55, Fawara Chowk near Doulatganj, right in the heart of Ujjain's central marketplace.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/*  GIFTING SECTION  */}
  <section className="gifting-section" id="gifting">
    <div className="container">
      <div className="gifting-grid">
        <div className="gifting-content">
          <div className="gifting-badge">✨ Festive Gifting Collection</div>
          <h2 className="gifting-title">Make Every Celebration More Special</h2>
          <p className="gifting-desc">
            Looking for a thoughtful gift for family, friends, clients or festive occasions? Explore our dry-fruit and gifting options at Best Quality. Thoughtfully packaged, traditional, and wholesome.
          </p>

          <div className="occasions-list">
            <span className="occasion-pill">Diwali</span>
            <span className="occasion-pill">Raksha Bandhan</span>
            <span className="occasion-pill">Weddings</span>
            <span className="occasion-pill">Housewarming</span>
            <span className="occasion-pill">Corporate Gifting</span>
            <span className="occasion-pill">Family Celebrations</span>
          </div>

          <div>
            <a href="tel:+918839315887" className="btn btn-gold" style={{ padding: "13px 26px", fontSize: "0.96rem" }}>
              <span>🎁 Ask About Gift Hampers</span>
            </a>
          </div>
        </div>

        <div className="gifting-visual">
          <div className="gifting-img-box">
            <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" alt="Festive Dry Fruit Hamper Boxes" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  INSTAGRAM SOCIAL PROOF GALLERY  */}
  <section className="instagram-section" id="instagram">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow">Social Updates</div>
        <h2 className="section-title">See What's New on Instagram</h2>
        <p className="section-desc">
          Follow <strong>@ms_best_quality</strong> for new products, offers and store updates from Fawara Chowk, Ujjain.
        </p>
      </div>

      <div className="insta-grid">
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80" alt="Instagram post almonds" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=400&q=80" alt="Instagram post cashews" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80" alt="Instagram post spices" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80" alt="Instagram post pistachios" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80" alt="Instagram post gift packs" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
        <div className="insta-item">
          <img src="https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=400&q=80" alt="Instagram post raisins" loading="lazy" />
          <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="insta-overlay" aria-label="View on Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </div>

      <div className="insta-action">
        <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          <span>Follow on Instagram →</span>
        </a>
      </div>
    </div>
  </section>

  {/*  CUSTOMER TRUST / REVIEWS  */}
  <section className="reviews-section" id="reviews">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow gold">Google Verified Trust</div>
        <h2 className="section-title">Loved by Customers in Ujjain</h2>
        <p className="section-desc">
          Trusted by local families, residents, and festival shoppers in Ujjain for high-quality dry fruits and aromatic spices.
        </p>
      </div>

      {/*  Verified Google Rating Summary Card  */}
      <div className="rating-summary-card">
        <div className="rating-stat-group">
          <div className="rating-big-num">4.9</div>
          <div>
            <div className="rating-meta-title">Trusted by Local Customers</div>
            <div className="rating-stars-large">★★★★★</div>
            <div className="rating-count-text">Overall Google Business Rating from verified reviews</div>
          </div>
        </div>
        <div>
          <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span>View Google Reviews</span>
          </a>
        </div>
      </div>

      {/*  Customer Feedback Cards (Authentic Tone)  */}
      <div className="reviews-grid">
        <div className="review-card">
          <div className="review-stars">★★★★★</div>
          <p className="review-text">
            "Very fresh dry fruits and excellent spices available at Fawara Chowk. The quality of almonds and cashews is always crisp and dependable."
          </p>
          <div className="reviewer-meta">
            <div className="reviewer-avatar">U</div>
            <div>
              <div className="reviewer-name">Ujjain Resident</div>
              <div className="reviewer-sub">Verified Local Customer</div>
            </div>
          </div>
        </div>

        <div className="review-card">
          <div className="review-stars">★★★★★</div>
          <p className="review-text">
            "We bought dry fruit hampers for family festive gifting. Very neatly arranged and the owners at Fawara Chowk were very polite and helpful."
          </p>
          <div className="reviewer-meta">
            <div className="reviewer-avatar">F</div>
            <div>
              <div className="reviewer-name">Festive Shopper</div>
              <div className="reviewer-sub">Gifting Customer</div>
            </div>
          </div>
        </div>

        <div className="review-card">
          <div className="review-stars">★★★★★</div>
          <p className="review-text">
            "Great whole spices and authentic masalas for our household cooking. It’s convenient to get everything in one spot near Doulatganj."
          </p>
          <div className="reviewer-meta">
            <div className="reviewer-avatar">D</div>
            <div>
              <div className="reviewer-name">Daily Grocery Customer</div>
              <div className="reviewer-sub">Regular Family Shopper</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  STORE LOCATION & DIRECTIONS  */}
  <section className="location-section" id="visit-us">
    <div className="container">
      <div className="section-header">
        <div className="section-eyebrow">Find Our Store</div>
        <h2 className="section-title">Visit M/S Best Quality in Ujjain</h2>
        <p className="section-desc">
          Conveniently located at Fawara Chowk, near Doulatganj. Walk in for fresh dry fruits, grocery essentials, and festival hampers.
        </p>
      </div>

      <div className="location-grid">
        {/*  Location Info Card  */}
        <div className="location-info-card">
          {/*  Address  */}
          <div className="info-group">
            <div className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <div className="info-label">Store Address</div>
              <div className="info-value">
                55, Fawara Chowk, near Doulatganj,<br />
                Kharakua Colony, Ujjain,<br />
                Madhya Pradesh 456010, India
              </div>
            </div>
          </div>

          {/*  Phone  */}
          <div className="info-group">
            <div className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div>
              <div className="info-label">Direct Contact Number</div>
              <div className="info-value">
                <a href="tel:+918839315887" style={{ color: "var(--primary)", fontWeight: 700 }}>+91 88393 15887</a>
              </div>
            </div>
          </div>

          {/*  Opening Hours  */}
          <div className="info-group">
            <div className="info-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div style={{ flexGrow: 1 }}>
              <div className="info-label">Opening Hours</div>
              <ul className="info-timing-list">
                <li><span>Monday – Saturday:</span> <strong>11:00 AM – 8:00 PM</strong></li>
                <li><span>Sunday:</span> <strong style={{ color: "#9E5B5B" }}>Closed</strong></li>
              </ul>
            </div>
          </div>

          {/*  CTAs  */}
          <div className="location-btn-row">
            <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              <span>Get Directions</span>
            </a>
            <a href="tel:+918839315887" className="btn btn-outline" style={{ flex: 1 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>Call Store</span>
            </a>
          </div>
        </div>

        {/*  Embedded Interactive Map  */}
        <div className="map-frame-box">
          <iframe 
            title="M/S Best Quality Dryfruits &amp; Masala House Location Map"
            src="https://maps.google.com/maps?q=55,+Fawara+Chowk,+near+Doulatganj,+Ujjain,+Madhya+Pradesh+456010&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            loading="lazy" 
            allowFullScreen 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </div>
  </section>

  {/*  LOCAL UJJAIN SEO SECTION  */}
  <section className="seo-content-section">
    <div className="container">
      <div className="seo-card">
        <h2>Your Local Dry Fruit &amp; Masala Store in Ujjain</h2>
        <p>
          M/S Best Quality Dryfruits &amp; Masala House is located at Fawara Chowk near Doulatganj in Ujjain. Customers can visit the store for dry fruits, masalas, grocery essentials, gifting options and selected food products.
        </p>
        <p>
          Whether you are looking for a reliable <strong>dry fruit shop in Ujjain</strong> for fresh almonds, cashews, and walnuts, or searching for authentic whole and powdered spices at a renowned <strong>masala shop in Ujjain</strong>, our store offers an extensive variety under one roof. Situated as a convenient <strong>dry fruit store near Fawara Chowk</strong> and serving residents seeking <strong>dry fruits near Doulatganj</strong>, we cater to daily cooking, sacred rituals, and seasonal celebrations.
        </p>
        <p>
          Along with serving as a trusted <strong>grocery store in Ujjain</strong>, we also curate tasteful <strong>dry fruit gift hampers Ujjain</strong> families and organizations choose for Diwali, weddings, and special events.
        </p>
        <div className="seo-tag-row">
          <span className="seo-tag">dry fruit shop in Ujjain</span>
          <span className="seo-tag">dry fruits in Ujjain</span>
          <span className="seo-tag">masala shop in Ujjain</span>
          <span className="seo-tag">dry fruit store near Fawara Chowk</span>
          <span className="seo-tag">dry fruits near Doulatganj</span>
          <span className="seo-tag">grocery store in Ujjain</span>
          <span className="seo-tag">dry fruit gift hampers Ujjain</span>
        </div>
      </div>
    </div>
  </section>

  {/*  FINAL CTA SECTION  */}
  <section className="final-cta-section">
    <div className="container final-cta-inner">
      <h2 className="final-cta-title">Looking for Quality Dry Fruits &amp; Masalas in Ujjain?</h2>
      <p className="final-cta-desc">
        Visit us at Fawara Chowk or call us to enquire about products, availability and current offers. We are always ready to assist you.
      </p>
      <div className="final-cta-btn-group">
        <a href="tel:+918839315887" className="btn btn-cta-gold">
          <span>📞 Call Now (+91 88393 15887)</span>
        </a>
        <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="btn btn-cta-light">
          <span>📍 Get Directions</span>
        </a>
        <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer" className="btn btn-cta-light">
          <span>📸 Follow Instagram</span>
        </a>
      </div>
    </div>
  </section>

  {/*  FOOTER  */}
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        {/*  Brand Summary  */}
        <div>
          <div className="footer-brand-title">M/S Best Quality</div>
          <div className="footer-tagline">Dryfruits • Masalas • Grocery • Gifting</div>
          <p className="footer-address">
            55, Fawara Chowk, near Doulatganj,<br />
            Kharakua Colony, Ujjain, Madhya Pradesh 456010
          </p>
          <p>
            <a href="tel:+918839315887" className="footer-phone-link">
              <span>📞 +91 88393 15887</span>
            </a>
          </p>
        </div>

        {/*  Quick Links  */}
        <div>
          <h3 className="footer-col-title">Quick Navigation</h3>
          <ul className="footer-nav-list">
            <li><a href="#home">Home</a></li>
            <li><a href="#products">Products &amp; Categories</a></li>
            <li><a href="#why-us">Why Choose Us</a></li>
            <li><a href="#offers">In-Store Offers</a></li>
            <li><a href="#reviews">Customer Reviews</a></li>
            <li><a href="#visit-us">Contact &amp; Visit Us</a></li>
          </ul>
        </div>

        {/*  Connect & Timings  */}
        <div>
          <h3 className="footer-col-title">Store &amp; Social</h3>
          <p style={{ marginBottom: "12px", fontSize: "0.88rem", color: "#9EABA3" }}>
            Mon – Sat: 11:00 AM – 8:00 PM<br />
            Sunday: Closed
          </p>
          <ul className="footer-nav-list">
            <li>
              <a href="https://www.instagram.com/ms_best_quality/" target="_blank" rel="noopener noreferrer">
                📸 Instagram: @ms_best_quality
              </a>
            </li>
            <li>
              <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer">
                📍 Google Maps Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          © 2026 M/S Best Quality Dryfruits &amp; Masala House. All rights reserved.
        </div>
        <div>
          Fawara Chowk, near Doulatganj, Ujjain, Madhya Pradesh
        </div>
      </div>
    </div>
  </footer>

  {/*  MOBILE STICKY BOTTOM BAR  */}
  <div className="mobile-bottom-bar" id="mobileBottomBar">
    <a href="tel:+918839315887" className="bottom-btn bottom-btn-call" aria-label="Call Store">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      <span>Call Now</span>
    </a>
    <a href="https://share.google/gzS1QF0zgvS4xpSxy" target="_blank" rel="noopener noreferrer" className="bottom-btn bottom-btn-maps" aria-label="Directions">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      <span>Directions</span>
    </a>
    <a href="https://wa.me/918839315887?text=Hello%20M/S%20Best%20Quality,%20I%20would%20like%20to%20enquire%20about%20your%20products." target="_blank" rel="noopener noreferrer" className="bottom-btn bottom-btn-wa" aria-label="WhatsApp Enquiry">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
    </a>
  </div>

  {/*  QUICK ENQUIRY MODAL  */}
  {/* QUICK ENQUIRY MODAL */}
  <div
    className={`modal-backdrop ${modalProduct ? "active" : ""}`}
    id="enquiryModal"
    onClick={(e) => {
      if (e.target === e.currentTarget) closeModal();
    }}
  >
    <div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="modalProductName">
      <button className="modal-close-btn" onClick={closeModal} aria-label="Close dialog">&times;</button>
      <h3 className="modal-title">Product Enquiry</h3>
      <p className="modal-subtitle">Connect directly with M/S Best Quality Dryfruits &amp; Masala House, Ujjain.</p>
      
      <div className="modal-product-highlight">
        <div>
          <div className="highlight-label">Selected Item</div>
          <div className="highlight-name" id="modalProductName">{modalProduct || "Dry Fruits & Spices"}</div>
        </div>
        <div style={{ fontSize: "0.85rem", color: "var(--gold-dark)", fontWeight: 600 }}>
          Price on Enquiry
        </div>
      </div>

      <div className="modal-actions">
        <a href="tel:+918839315887" className="btn btn-primary" style={{ width: "100%" }}>
          📞 Call Store Now (+91 88393 15887)
        </a>
        <a
          href={`https://wa.me/918839315887?text=${encodeURIComponent(`Hello M/S Best Quality Dryfruits & Masala House, I would like to enquire about availability and price for: ${modalProduct || "Dry Fruits & Spices"}.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ backgroundColor: "#25D366", color: "#FFFFFF", width: "100%" }}
        >
          💬 Enquire on WhatsApp
        </a>
        <a
          href="https://share.google/gzS1QF0zgvS4xpSxy"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ width: "100%" }}
        >
          📍 Get Store Directions
        </a>
      </div>
    </div>
  </div>
    </div>
  );
}
