import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  MapPin,
  Heart,
  UtensilsCrossed,
  Sparkles,
  Instagram,
  Facebook,
  Star,
  Phone,
  Mail,
} from "lucide-react";

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".fade-up");
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);
}

const LeafSVG = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 60 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M30 95 C30 95 5 70 5 40 C5 15 18 5 30 5 C42 5 55 15 55 40 C55 70 30 95 30 95Z"
      fill="currentColor"
    />
    <path
      d="M30 95 L30 20"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
    />
  </svg>
);

const OrnamentDivider = ({ label }) => (
  <div className="flex items-center justify-center gap-4 mb-6">
    <div className="flex items-center gap-1 opacity-50">
      <div className="w-12 h-px bg-current" />
      <div className="w-1.5 h-1.5 rotate-45 bg-current" />
      <div className="w-12 h-px bg-current" />
    </div>
    <span className="uppercase tracking-[0.25em] text-xs font-medium opacity-70">
      {label}
    </span>
    <div className="flex items-center gap-1 opacity-50">
      <div className="w-12 h-px bg-current" />
      <div className="w-1.5 h-1.5 rotate-45 bg-current" />
      <div className="w-12 h-px bg-current" />
    </div>
  </div>
);

function Lightbox({ imgs, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const total = imgs.length;
  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.92)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 20, right: 24, background: "none", border: "none",
        color: "#F7F3EC", fontSize: "2rem", cursor: "pointer", lineHeight: 1, opacity: 0.7,
      }}>×</button>
      <button onClick={prev} style={{
        position: "absolute", left: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#F7F3EC", width: 52, height: 52, borderRadius: "50%", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", zIndex: 2,
      }}>‹</button>
      <img onClick={(e) => e.stopPropagation()} src={imgs[idx]} alt="" style={{
        maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain",
        borderRadius: 4, boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
      }} />
      <button onClick={next} style={{
        position: "absolute", right: 20, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#F7F3EC", width: 52, height: 52, borderRadius: "50%", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", zIndex: 2,
      }}>›</button>
      <div style={{ position: "absolute", bottom: 24, display: "flex", gap: 8 }}>
        {imgs.map((_, i) => (
          <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} style={{
            width: i === idx ? 28 : 8, height: 8, borderRadius: 4, border: "none", padding: 0,
            background: i === idx ? "#C9A227" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "width 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

function AmbienteEditorial({ ambiente, reversed }) {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const imgs = ambiente.imgs;

  const imgBtn = (src, idx, extraStyle) => (
    <button key={idx} onClick={() => setLightboxIdx(idx)} style={{
      padding: 0, border: "none", cursor: "zoom-in", overflow: "hidden",
      display: "block", background: "#060d09", ...extraStyle,
    }}>
      <img src={src} alt="" style={{
        width: "100%", height: "100%", objectFit: "cover",
        transition: "transform 0.5s ease",
        display: "block",
      }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    </button>
  );

  return (
    <div className="fade-up" style={{ marginBottom: 80 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          color: "#F7F3EC", fontWeight: 700, margin: 0,
        }}>{ambiente.title}</h3>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)", minWidth: 20 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ambiente.tags.map((tag) => (
            <span key={tag} style={{
              background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.25)",
              color: "#C9A227", fontSize: "0.62rem", letterSpacing: "0.1em",
              textTransform: "uppercase", padding: "4px 10px",
              fontFamily: "'Montserrat', sans-serif",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Mosaic grid */}
      {imgs.length >= 4 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: reversed ? "1fr 1fr 1.8fr" : "1.8fr 1fr 1fr",
          gridTemplateRows: "260px 200px",
          gap: 6,
        }}>
          {reversed ? (
            <>
              {imgBtn(imgs[1], 1, { gridColumn: "1", gridRow: "1", borderRadius: "4px 0 0 0" })}
              {imgBtn(imgs[2], 2, { gridColumn: "2", gridRow: "1", borderRadius: "0" })}
              {imgBtn(imgs[0], 0, { gridColumn: "3", gridRow: "1 / 3", borderRadius: "0 4px 4px 0" })}
              {imgBtn(imgs[3], 3, { gridColumn: "1 / 3", gridRow: "2", borderRadius: "0 0 0 4px" })}
            </>
          ) : (
            <>
              {imgBtn(imgs[0], 0, { gridColumn: "1", gridRow: "1 / 3", borderRadius: "4px 0 0 4px" })}
              {imgBtn(imgs[1], 1, { gridColumn: "2", gridRow: "1", borderRadius: "0" })}
              {imgBtn(imgs[2], 2, { gridColumn: "3", gridRow: "1", borderRadius: "0 4px 0 0" })}
              {imgBtn(imgs[3], 3, { gridColumn: "2 / 4", gridRow: "2", borderRadius: "0 0 4px 0" })}
            </>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${imgs.length}, 1fr)`, gap: 6, height: 320 }}>
          {imgs.map((src, idx) => imgBtn(src, idx, { borderRadius: 4 }))}
        </div>
      )}

      {/* Description */}
      <p style={{
        color: "rgba(247,243,236,0.5)", fontSize: "0.88rem", lineHeight: 1.85,
        fontFamily: "'Lora', serif", marginTop: 14, maxWidth: 600,
      }}>{ambiente.desc}</p>

      {lightboxIdx !== null && (
        <Lightbox imgs={imgs} startIdx={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}

function AmbientesGallery({ ambientes }) {
  return (
    <div>
      {ambientes.map((amb, i) => (
        <AmbienteEditorial key={i} ambiente={amb} reversed={i % 2 === 1} />
      ))}
    </div>
  );
}


export default function LandingPage() {
  useScrollAnimation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappLink = "https://wa.me/554732279537";

  return (
    <div
      className="min-h-screen text-white selection:bg-[#B86E4B] selection:text-white"
      style={{ fontFamily: "'Lora', serif", background: "#0D1E14" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-leaf-1 {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-18px) rotate(-10deg); }
        }
        @keyframes float-leaf-2 {
          0%, 100% { transform: translateY(0px) rotate(25deg); }
          50% { transform: translateY(-12px) rotate(20deg); }
        }
        @keyframes float-leaf-3 {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          60% { transform: translateY(-22px) rotate(2deg); }
        }
        @keyframes float-img {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-img-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .leaf-1 { animation: float-leaf-1 6s ease-in-out infinite; }
        .leaf-2 { animation: float-leaf-2 8s ease-in-out infinite 1s; }
        .leaf-3 { animation: float-leaf-3 7s ease-in-out infinite 2s; }
        .float-img-a { animation: float-img 5s ease-in-out infinite; }
        .float-img-b { animation: float-img-slow 7s ease-in-out infinite 1.5s; }
        .float-img-c { animation: float-img 6s ease-in-out infinite 0.8s; }
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .ambiente-card:hover .ambiente-img {
          transform: scale(1.07);
        }
        .ambiente-card:hover .ambiente-overlay {
          opacity: 1;
        }
        .btn-primary {
          background: transparent;
          border: 1.5px solid rgba(201,162,39,0.8);
          color: #C9A227;
          padding: 12px 32px;
          letter-spacing: 0.1em;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.3s, color 0.3s, transform 0.2s;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          background: #C9A227;
          color: #0D1E14;
          transform: translateY(-2px);
        }
        .btn-dark {
          background: #1C3F3A;
          border: none;
          color: #F7F3EC;
          padding: 14px 36px;
          letter-spacing: 0.08em;
          font-size: 0.85rem;
          text-transform: uppercase;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 2px;
        }
        .btn-dark:hover {
          background: #162F2B;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(28,63,58,0.4);
        }
        .btn-ghost {
          background: transparent;
          border: 1.5px solid rgba(247,243,236,0.35);
          color: #F7F3EC;
          padding: 14px 36px;
          letter-spacing: 0.08em;
          font-size: 0.85rem;
          text-transform: uppercase;
          font-family: 'Montserrat', sans-serif;
          transition: background 0.3s, border-color 0.3s, transform 0.2s;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 2px;
        }
        .btn-ghost:hover {
          background: rgba(247,243,236,0.08);
          border-color: rgba(247,243,236,0.6);
          transform: translateY(-2px);
        }
        .stat-item {
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .stat-item:last-child { border-right: none; }
      ` }} />

      {/* NAV */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          background: isScrolled
            ? "rgba(13,30,20,0.95)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          padding: isScrolled ? "16px 0" : "24px 0",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <img
              src="/images/logo-casa97.png"
              alt="Casa97"
              style={{ height: 56, width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
            />
          </a>

          <div className="hidden md:flex items-center gap-10">
            {["Ambientes", "Gastronomia", "Momentos"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: "rgba(247,243,236,0.7)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A227")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(247,243,236,0.7)")
                }
              >
                {item}
              </a>
            ))}
            <button
              className="btn-primary"
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              Reservar mesa
            </button>
          </div>

          <button
            className="md:hidden p-2"
            style={{ color: "#F7F3EC" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="absolute top-full left-0 w-full flex flex-col gap-6 px-6 py-8 md:hidden"
            style={{
              background: "rgba(13,30,20,0.98)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {["Ambientes", "Gastronomia", "Momentos"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: "#F7F3EC",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.3rem",
                  textDecoration: "none",
                }}
              >
                {item}
              </a>
            ))}
            <button
              className="btn-primary w-full justify-center mt-2"
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              Reservar mesa
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 50%, #142A1A 0%, #0D1E14 60%, #080F0A 100%)",
        }}
      >
        {/* Mobile background image */}
        <div className="lg:hidden absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/hero-casa.jpg"
            alt=""
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "blur(3px) brightness(0.35)",
              transform: "scale(1.06)",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(8,15,10,0.5) 0%, rgba(8,15,10,0.2) 40%, rgba(8,15,10,0.75) 100%)",
          }} />
        </div>

        {/* Scattered leaves */}
        <LeafSVG
          className="leaf-1 absolute w-10 h-16 text-green-700 opacity-40 pointer-events-none"
          style={{ top: "15%", left: "42%", zIndex: 20 }}
        />
        <LeafSVG
          className="leaf-2 absolute w-7 h-12 text-green-600 opacity-30 pointer-events-none"
          style={{ top: "55%", left: "48%", zIndex: 20 }}
        />
        <LeafSVG
          className="leaf-3 absolute w-12 h-20 text-green-800 opacity-25 pointer-events-none"
          style={{ top: "20%", right: "8%", zIndex: 6 }}
        />
        <LeafSVG
          className="leaf-1 absolute w-8 h-14 text-green-700 opacity-35 pointer-events-none"
          style={{ bottom: "20%", right: "22%", zIndex: 6 }}
        />
        <LeafSVG
          className="leaf-2 absolute w-6 h-10 text-green-600 opacity-30 pointer-events-none"
          style={{ bottom: "30%", left: "35%", zIndex: 20 }}
        />

        {/* Floating images (right side) */}
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden lg:block">
          {/* Main large image — casa */}
          <div
            className="float-img-a absolute rounded-full overflow-hidden shadow-2xl"
            style={{
              width: 340,
              height: 340,
              top: "50%",
              left: "30%",
              transform: "translateY(-50%)",
              zIndex: 10,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 6px rgba(201,162,39,0.15)",
            }}
          >
            <img
              src="/images/hero-casa.jpg"
              alt="Casa97"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Smaller image — drinks */}
          <div
            className="float-img-b absolute rounded-full overflow-hidden"
            style={{
              width: 210,
              height: 210,
              top: "10%",
              left: "52%",
              zIndex: 9,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 4px rgba(201,162,39,0.1)",
            }}
          >
            <img
              src="/images/hero-drinks.jpg"
              alt="Drinks Casa97"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Glow under images */}
          <div
            className="absolute rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              width: 500,
              height: 300,
              top: "40%",
              left: "25%",
              background: "#B86E4B",
              transform: "translateY(-50%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full pt-28 pb-20 md:pt-36 md:pb-28 relative z-10">
          <div className="max-w-full lg:max-w-[50%]">
            <div className="fade-up">
              <OrnamentDivider label="A casa mais charmosa de Joinville" />
            </div>

            <h1
              className="fade-up"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                lineHeight: 1.1,
                color: "#F7F3EC",
                marginBottom: "1.5rem",
                fontWeight: 700,
                transitionDelay: "0.1s",
              }}
            >
              Uma experiência gastronômica para noites que merecem ser lembradas
            </h1>

            <p
              className="fade-up"
              style={{
                color: "rgba(247,243,236,0.65)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: "2.5rem",
                maxWidth: "520px",
                transitionDelay: "0.2s",
                fontFamily: "'Lora', serif",
              }}
            >
              À primeira vista, nem parece um restaurante. A entrada, as mesas, o banheiro, tudo lembra uma casa normal. Um portão de ferro, um jardim na entrada e a porta principal que dá acesso para os fundos da casa. Tudo simples, mas elegante e muito bonito. Atendimento personalizado, alimentos frescos e bem preparados, temperos diferenciados. Oferecer bem-estar e trazer as boas lembranças do aconchego do lar são a nossa missão.
            </p>

            <div
              className="flex flex-wrap gap-4 mb-10 fade-up"
              style={{ transitionDelay: "0.3s" }}
            >
              <button
                className="btn-dark"
                onClick={() => window.open(whatsappLink, "_blank")}
              >
                Reservar agora
              </button>
              <button
                className="btn-ghost"
                onClick={() =>
                  document
                    .getElementById("ambientes")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Conhecer ambientes
              </button>
            </div>

            {/* Rating */}
            <div
              className="flex items-center gap-3 fade-up"
              style={{ transitionDelay: "0.4s" }}
            >
              <div className="flex">
                {[1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#C9A227"
                    stroke="none"
                  />
                ))}
                <Star size={18} fill="none" stroke="#C9A227" strokeWidth={1.5} />
              </div>
              <span
                style={{
                  color: "rgba(247,243,236,0.55)",
                  fontSize: "0.8rem",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                4.8/5 &nbsp;·&nbsp; Avaliação média dos nossos clientes
              </span>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #0D1E14)",
          }}
        />
      </section>

      {/* STATS BAR */}
      <div
        className="border-y"
        style={{
          background: "#0D1E14",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "6", label: "Ambientes diferentes" },
              { value: "5", label: "Opções de mesas decoradas" },
              { value: "10", label: "Anos de existência" },
              { value: "+500", label: "Pedidos de casamento e namoro" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-item py-8 px-4 text-center fade-up"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2.2rem",
                    color: "#C9A227",
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: "0.4rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: "rgba(247,243,236,0.45)",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AMBIENTES */}
      <section
        id="ambientes"
        className="py-24 md:py-32 px-6 md:px-12"
        style={{ background: "#0D1E14" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 md:mb-20 fade-up" style={{ color: "#F7F3EC" }}>
            <OrnamentDivider label="Nossos Espaços" />
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                color: "#F7F3EC",
                fontWeight: 700,
                marginTop: "0.5rem",
              }}
            >
              Ambientes que transformam a noite
            </h2>
            <p
              style={{
                color: "rgba(247,243,236,0.5)",
                maxWidth: 500,
                margin: "1.2rem auto 0",
                fontSize: "0.95rem",
                lineHeight: 1.8,
                fontFamily: "'Lora', serif",
              }}
            >
              Cada espaço da Casa97 foi pensado para criar uma atmosfera
              diferente — do jantar romântico à celebração em grupo.
            </p>
          </div>

          <AmbientesGallery ambientes={[
                {
                  title: "Sacada, nosso espaço mais desejado",
                  desc: "Ideal para casais e ocasiões românticas, com vista especial e um clima intimista que torna a experiência ainda mais inesquecível.",
                  tags: ["Casal", "Romântico", "Vista"],
                  imgs: ["/images/sacada-1.jpg", "/images/sacada-2.jpg", "/images/sacada-3.jpg", "/images/sacada-4.jpg"],
                },
                {
                  title: "Lareira",
                  desc: "Aconchego e elegância em um ambiente perfeito para as noites frias de Joinville, ideal para encontros a dois e pequenos grupos.",
                  tags: ["Aconchegante", "Inverno", "Climatizado"],
                  imgs: ["/images/lareira-1.jpg", "/images/lareira-2.jpg", "/images/lareira-3.jpg", "/images/lareira-4.jpg"],
                },
                {
                  title: "Bar",
                  desc: "Ambiente climatizado e com vista, ideal para casais e grupos em uma atmosfera informal e descontraída.",
                  tags: ["Vista", "Grupos", "Informal"],
                  imgs: ["/images/bar-1.jpg", "/images/bar-2.jpg", "/images/bar-3.jpg", "/images/bar-4.jpg"],
                },
                {
                  title: "Espelhos",
                  desc: "Perfeito para um jantar intimista, com decoração única e apenas três mesas no ambiente.",
                  tags: ["Privativo", "Romântico", "Especial"],
                  imgs: ["/images/espelhos-1.jpg", "/images/espelhos-2.jpg", "/images/espelhos-3.jpg", "/images/espelhos-4.jpg"],
                },
                {
                  title: "Jardim",
                  desc: "Maior ambiente do restaurante, atende casais e grupos que procuram momentos especiais cercados pela natureza.",
                  tags: ["Natureza", "Celebração", "Até 50 pessoas"],
                  imgs: ["/images/jardim-1.jpg", "/images/jardim-2.jpg", "/images/jardim-3.jpg", "/images/jardim-4.jpg"],
                },
                {
                  title: "Bambus",
                  desc: "Um espaço pequeno e acolhedor, perfeito para encontros reservados e pequenas confraternizações. Possui apenas três mesas.",
                  tags: ["Reservado", "Pequenos grupos", "Até 9 pessoas"],
                  imgs: ["/images/bambus-1.jpg", "/images/bambus-2.jpg", "/images/bambus-3.jpg"],
                },
              ]} />
        </div>
      </section>

      {/* GASTRONOMIA */}
      <section
        id="gastronomia"
        className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0a1a10 0%, #111E15 60%, #0D1E14 100%)",
        }}
      >
        {/* Large leaf decoration */}
        <LeafSVG
          className="absolute opacity-5 pointer-events-none"
          style={{
            width: 300,
            height: 500,
            right: -60,
            top: -80,
            color: "#4a8a50",
          }}
        />

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Image */}
          <div className="relative fade-up order-2 lg:order-1">
            <div
              style={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
                aspectRatio: "4/5",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
              }}
            >
              <img
                src="/images/hero-drinks.jpg"
                alt="Gastronomia Casa97"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(13,30,20,0.2) 0%, transparent 60%)",
                }}
              />
            </div>
            {/* Gold frame accent */}
            <div
              style={{
                position: "absolute",
                top: -12,
                left: -12,
                right: 12,
                bottom: 12,
                border: "1px solid rgba(201,162,39,0.2)",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Text */}
          <div className="fade-up order-1 lg:order-2" style={{ transitionDelay: "0.15s" }}>
            <div style={{ color: "#C9A227" }}>
              <OrnamentDivider label="Menu & Bar" />
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#F7F3EC",
                lineHeight: 1.15,
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              Gastronomia afetiva, drinks que completam a experiência
            </h2>
            <p
              style={{
                color: "rgba(247,243,236,0.55)",
                lineHeight: 1.9,
                marginBottom: "2.5rem",
                fontFamily: "'Lora', serif",
                fontSize: "0.95rem",
              }}
            >
              Da comfort food às sobremesas, dos clássicos às criações autorais,
              tudo na Casa97 foi pensado para tornar a experiência acolhedora,
              memorável e cheia de sabor.
            </p>

            <ul style={{ listStyle: "none", padding: 0, marginBottom: "2.5rem" }}>
              {[
                "Entradas, pratos individuais e para compartilhar",
                "Fondues e sobremesas para momentos especiais",
                "Drinks clássicos, releituras e autorais",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    color: "rgba(247,243,236,0.75)",
                    fontSize: "0.9rem",
                    fontFamily: "'Lora', serif",
                    marginBottom: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#C9A227",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <button
              className="btn-primary"
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* MOMENTOS ESPECIAIS */}
      <section
        id="momentos"
        className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
        style={{ background: "#0A1510" }}
      >
        {/* Background image with deep overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/special-moment.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(10,21,16,1) 0%, rgba(10,21,16,0.85) 60%, rgba(10,21,16,0.7) 100%)",
          }}
        />

        <div className="max-w-[1280px] mx-auto relative z-10 grid grid-cols-1 xl:grid-cols-[45%_55%] gap-16 items-center">
          <div className="fade-up">
            <div style={{ color: "#C9A227" }}>
              <OrnamentDivider label="Ocasiões Especiais" />
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#F7F3EC",
                lineHeight: 1.15,
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              Para pedidos, comemorações e noites inesquecíveis
            </h2>
            <p
              style={{
                color: "rgba(247,243,236,0.55)",
                lineHeight: 1.9,
                marginBottom: "2.5rem",
                fontFamily: "'Lora', serif",
                fontSize: "0.95rem",
                maxWidth: 440,
              }}
            >
              A Casa97 é o cenário ideal para transformar jantares em lembranças.
              De mesas decoradas a ocasiões especiais, criamos a atmosfera certa
              para quem quer viver algo marcante.
            </p>
            <button
              className="btn-primary"
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              FALAR NO WHATSAPP
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Mesas Decoradas",
                desc: "Atmosfera intimista para viver o momento com calma e beleza.",
                img: "/images/momentos-floricultura.jpg",
              },
              {
                title: "Floricultura",
                desc: "Conheça nossas opções de flores para deixar sua noite ainda mais especial.",
                img: "/images/momentos-confraternizacoes.jpg",
              },
              {
                title: "Confraternizações",
                desc: "Celebre momentos especiais na Casa 97.",
                img: "/images/momentos-mesas.jpg",
              },
            ].map((momento, i) => (
              <div
                key={i}
                className="group fade-up"
                style={{
                  transitionDelay: `${i * 120}ms`,
                  position: "relative",
                  aspectRatio: "3/4",
                  borderRadius: "4px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  src={momento.img}
                  alt={momento.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s ease",
                  }}
                  className="group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,21,16,0.95) 0%, rgba(10,21,16,0.3) 50%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 20px",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: "#C9A227",
                      marginBottom: "10px",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.1rem",
                      color: "#F7F3EC",
                      marginBottom: "0.4rem",
                      fontWeight: 600,
                    }}
                  >
                    {momento.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(247,243,236,0.55)",
                      fontSize: "0.78rem",
                      lineHeight: 1.7,
                      fontFamily: "'Lora', serif",
                    }}
                  >
                    {momento.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUE CASA97 */}
      <section
        className="py-24 md:py-32 px-6 md:px-12"
        style={{ background: "#0D1E14" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16 fade-up" style={{ color: "#C9A227" }}>
            <OrnamentDivider label="Por que nos escolher" />
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                color: "#F7F3EC",
                fontWeight: 700,
                marginTop: "0.5rem",
              }}
            >
              A essência Casa97
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Mais que um restaurante",
                desc: "Uma experiência que une gastronomia, atmosfera e acolhimento.",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Clima intimista",
                desc: "Ambientes pensados para encontros especiais e noites memoráveis.",
              },
              {
                icon: <UtensilsCrossed className="w-6 h-6" />,
                title: "Experiência completa",
                desc: "Comfort food, drinks e ambientação em perfeita harmonia.",
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: "Um refúgio em Joinville",
                desc: "Um lugar único para quem busca charme, beleza e presença.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  padding: "32px 28px",
                  background: "#111E15",
                  border: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1px solid rgba(201,162,39,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#C9A227",
                    margin: "0 auto 20px",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.15rem",
                    color: "#F7F3EC",
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "rgba(247,243,236,0.45)",
                    fontSize: "0.85rem",
                    lineHeight: 1.8,
                    fontFamily: "'Lora', serif",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA RESERVA */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-12 overflow-hidden text-center"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 100%, #1C3F3A 0%, #0D1E14 70%)",
        }}
      >
        <LeafSVG
          className="leaf-2 absolute opacity-10 pointer-events-none"
          style={{
            width: 180,
            height: 300,
            left: 40,
            bottom: -40,
            color: "#4a8a50",
          }}
        />
        <LeafSVG
          className="leaf-1 absolute opacity-10 pointer-events-none"
          style={{
            width: 140,
            height: 230,
            right: 60,
            top: 20,
            color: "#4a8a50",
          }}
        />

        <div className="max-w-2xl mx-auto relative z-10 fade-up">
          <div style={{ color: "#C9A227" }}>
            <OrnamentDivider label="Faça sua Reserva" />
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              color: "#F7F3EC",
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: "1.2rem",
            }}
          >
            Reserve sua mesa e viva a experiência Casa97
          </h2>
          <p
            style={{
              color: "rgba(247,243,236,0.5)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              fontFamily: "'Lora', serif",
            }}
          >
            Ambientes únicos, clima acolhedor e uma noite pensada para ser lembrada.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-10 text-sm"
            style={{ color: "rgba(247,243,236,0.55)", fontFamily: "'Montserrat', sans-serif" }}
          >
            {[
              "Ideal para casais, encontros e celebrações",
              "Reserva simples e rápida",
              "Atendimento acolhedor e personalizado",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2 justify-center">
                <span style={{ color: "#C9A227", fontWeight: 700 }}>✓</span>
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="btn-dark"
              style={{ padding: "16px 44px", fontSize: "0.85rem" }}
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              FALAR NO WHATSAPP
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-16 px-6 md:px-12"
        style={{
          background: "#080F0A",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            <div className="md:col-span-2">
              <div style={{ marginBottom: "1rem" }}>
                <img
                  src="/images/logo-casa97.png"
                  alt="Casa97"
                  style={{ height: 64, width: "auto", display: "block", filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p
                style={{
                  color: "rgba(247,243,236,0.4)",
                  fontSize: "0.85rem",
                  lineHeight: 1.8,
                  maxWidth: 320,
                  marginBottom: "1.5rem",
                  fontFamily: "'Lora', serif",
                }}
              >
                A casa mais charmosa de Joinville. Uma experiência que une
                gastronomia, atmosfera e acolhimento para noites memoráveis.
              </p>
              <div className="flex gap-3">
                {[Instagram, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(247,243,236,0.4)",
                      transition: "border-color 0.2s, color 0.2s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#C9A227";
                      e.currentTarget.style.color = "#C9A227";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "rgba(247,243,236,0.4)";
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#F7F3EC",
                  fontSize: "1.05rem",
                  marginBottom: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Navegação
              </h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["Ambientes", "Gastronomia", "Momentos Especiais", "Reservas"].map(
                  (item) => (
                    <li key={item} style={{ marginBottom: "0.75rem" }}>
                      <a
                        href="#"
                        style={{
                          color: "rgba(247,243,236,0.4)",
                          fontSize: "0.85rem",
                          textDecoration: "none",
                          fontFamily: "'Montserrat', sans-serif",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#C9A227")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "rgba(247,243,236,0.4)")
                        }
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#F7F3EC",
                  fontSize: "1.05rem",
                  marginBottom: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Contato
              </h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {[
                  {
                    icon: <MapPin size={14} />,
                    text: "Rua Arco-Íris, 97 - Iririú\nJoinville - SC",
                  },
                  { icon: <Phone size={14} />, text: "(47) 3227-9537" },
                  { icon: <Mail size={14} />, text: "contatocasa97@gmail.com" },
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      color: "rgba(247,243,236,0.4)",
                      fontSize: "0.82rem",
                      fontFamily: "'Montserrat', sans-serif",
                      lineHeight: 1.7,
                      marginBottom: "0.9rem",
                    }}
                  >
                    <span style={{ color: "#C9A227", marginTop: 2, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span style={{ whiteSpace: "pre-line" }}>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="md:flex-row"
          >
            <p
              style={{
                color: "rgba(247,243,236,0.25)",
                fontSize: "0.75rem",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              © {new Date().getFullYear()} Casa97. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              {["Política de Privacidade", "Termos de Uso"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    color: "rgba(247,243,236,0.25)",
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    fontFamily: "'Montserrat', sans-serif",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "rgba(247,243,236,0.6)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(247,243,236,0.25)")
                  }
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
