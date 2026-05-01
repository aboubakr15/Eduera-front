import React, { useState, useEffect } from "react";
import heroImg from "../../assets/images/campus.jpg";

const Hero = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setOffset({ x, y });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideUpDelay {
          0%, 30% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideUpDelay2 {
          0%, 50% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideUpDelay3 {
          0%, 65% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBgParallax {
          from { transform: scale(1.08); }
          to { transform: scale(1); }
        }
        .hero-bg-animate {
          animation: heroBgParallax 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-overlay-animate {
          animation: heroFadeIn 1.2s ease forwards;
        }
        .hero-h1-animate {
          animation: heroSlideUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-p-animate {
          animation: heroSlideUpDelay 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .hero-btn-animate {
          animation: heroSlideUpDelay2 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
      <div
        className="absolute inset-0 bg-cover bg-center hero-bg-animate"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-[#1B2036]/65 hero-overlay-animate" />
      </div>

      <div className="relative z-10 flex flex-col justify-center h-full px-20 max-w-2xl text-white">
        <h1 className="font-tiro-devanagari text-5xl text-white font-normal leading-tight mb-5 hero-h1-animate">
          launching our students into{" "}
          <span className="text-[#D67A1E]">Bright Future</span>
        </h1>

        <p className="font-Inter text-sm leading-relaxed text-white/75 mb-9 max-w-xl hero-p-animate">
          Unlock New Opportunities, Master Your Skills, and Shape Your Future
          Through Learning and Growth.
        </p>

        <button
          className="self-start text-white font-Inter
                    font-Inter text-[15px] px-8 py-3 rounded-xl 0 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none
                    bg-gradient-to-r from-[#D67A1E] to-[#CE904E] hero-btn-animate
            "
        >
          Start your journey
        </button>
      </div>
    </section>
  );
};

export default Hero;
