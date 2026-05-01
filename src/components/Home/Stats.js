import { useState, useEffect, useRef, useCallback } from "react";
import Img from "../../assets/images/graduate.jpg";
import cs from "../../assets/images/cs.jpg";
import is from "../../assets/images/is.jpg";
import it from "../../assets/images/it.jpg";
import sw from "../../assets/images/sw.jpg";
import camp from "../../assets/images/camp.jpg";

const CountUp = ({ value, label }) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const hasRun = useRef(false);

  const animate = useCallback(() => {
    const isSpecial = value === "24/7";
    if (isSpecial) {
      let start = null;
      const duration = 1200;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const fakeNumerator = Math.floor(progress * 24);
        setDisplay(`${fakeNumerator}/7`);
        if (progress < 1) requestAnimationFrame(step);
        else setDisplay("24/7");
      };
      requestAnimationFrame(step);
      return;
    }

    const hasPlus = value.startsWith("+");
    const raw = value.replace(/[^0-9]/g, "");
    const target = parseInt(raw, 10);
    const hasComma = value.includes(",");
    const duration = 1600;
    let start = null;

    const format = (n) => {
      let s = hasComma ? n.toLocaleString() : String(n);
      return hasPlus ? "+" + s : s;
    };

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(format(Math.floor(eased * target)));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(format(target));
    };

    requestAnimationFrame(step);
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            animate();
          }
        });
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-tiro-devanagari text-4xl text-[#D67A1E] mb-2">
        {display}
      </div>
      <div className="font-tiro-devanagari text-lg text-[#D67A1E]">{label}</div>
    </div>
  );
};

const Stats = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lineHeight, setLineHeight] = useState(20);
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 10;
    const y = (clientY / window.innerHeight - 0.5) * 10;
    setOffset({ x, y });
  };
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const newHeight = Math.min(150, 20 + scrollTop * 0.5);
    setLineHeight(newHeight);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --- Intersection Observer for scroll-triggered animations ---
  const observerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("stats-in-view");
          }
        });
      },
      { threshold: 0.15 },
    );
    observerRef.current = observer;
    document
      .querySelectorAll(".stats-reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const departments = [
    {
      id: 1,
      title: "Software Engineering",
      description:
        "Building reliable software through planning, designing, testing, and continuous improvement.",
      image: sw,
    },
    {
      id: 2,
      title: "Computer Science",
      description:
        "Understanding how computers work from algorithms to systems to solve real-world problems.",
      image: cs,
    },
    {
      id: 3,
      title: "Internet Technology",
      description:
        "Exploring web technologies, networking, and online platforms to create secure, efficient, and innovative digital solutions.",
      image: it,
    },
    {
      id: 4,
      title: "Information Systems",
      description:
        "Studying how to collect, process, and manage data to support business decisions and optimize organizational performance.",
      image: is,
    },
  ];

  return (
    <div>
      <style>{`
        @keyframes statsSlideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes statsSlideLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes statsSlideRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes statsScaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }

        .stats-reveal {
          opacity: 0;
        }

        .stats-reveal-up       { transform: translateY(36px); }
        .stats-reveal-fade     { }
        .stats-reveal-left     { transform: translateX(-32px); }
        .stats-reveal-right    { transform: translateX(32px); }
        .stats-reveal-scale    { transform: scale(0.94); }

        .stats-reveal.stats-in-view {
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          animation-duration: 0.85s;
        }
        .stats-reveal-up.stats-in-view    { animation-name: statsSlideUp; }
        .stats-reveal-fade.stats-in-view  { animation-name: statsFadeIn; }
        .stats-reveal-left.stats-in-view  { animation-name: statsSlideLeft; }
        .stats-reveal-right.stats-in-view { animation-name: statsSlideRight; }
        .stats-reveal-scale.stats-in-view { animation-name: statsScaleIn; }

        .stats-delay-1 { animation-delay: 0.08s; }
        .stats-delay-2 { animation-delay: 0.18s; }
        .stats-delay-3 { animation-delay: 0.28s; }
        .stats-delay-4 { animation-delay: 0.38s; }
        .stats-delay-5 { animation-delay: 0.48s; }
      `}</style>

      <div className="px-10 pt-20 bg-[#fffdfc]">
        <div className="flex justify-center mb-10">
          <div
            className="w-px  bg-amber-400  transition-all duration-200"
            style={{ height: `${lineHeight}px` }}
          />
        </div>

        <h2 className="font-serif text-4xl font-normal text-amber-600 bg-[#fffdfc] text-center mb-10 stats-reveal stats-reveal-up">
          <span className="font-tiro-devanagari">Where challenge meets</span>
          <span className="font-style-script text-5xl"> hope.</span>
        </h2>
        <p className="font-serif text-2xl leading-relaxed  text-amber-950  text-center max-w-2xl mx-auto mb-20 stats-reveal stats-reveal-up stats-delay-1">
          One platform combines modern technology with effective teaching
          methods, offering students an interactive and personalized learning
          experience while providing educators with tools to manage courses
          efficiently.
        </p>
      </div>

      <div className="bg-[#f0ede8]  px-16 py-14 flex justify-around items-center flex-wrap gap-8">
        {[
          { value: "+500", label: "Professor and TA" },
          { value: "+10,000", label: "Students" },
          { value: "+120", label: "Courses" },
          { value: "24/7", label: "Available" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`stats-reveal stats-reveal-up stats-delay-${i + 1}`}
          >
            <CountUp value={stat.value} label={stat.label} />
          </div>
        ))}
      </div>

      <div className="flex flex-row w-full h-full">
        <div className="relative w-2/5 h-[600px] overflow-hidden stats-reveal stats-reveal-left">
          <img
            src={Img}
            alt="Graduation"
            className=" w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1B2036]/35" />
        </div>

        <div className="w-3/5 bg-[#1B2036] flex flex-col justify-center px-16">
          <h2 className="font-tiro-devanagari text-4xl font-normal text-white mb-8 stats-reveal stats-reveal-up stats-delay-1">
            Why EDUera ?
          </h2>
          <p className="font-Inter text-lg leading-[2.2] text-gray-300/80 mb-20 stats-reveal stats-reveal-up stats-delay-2">
            It's an AI powered platform that helps students manage their
            courses, follow up on academic materials, and get instant support
            through an intelligent chatbot, making learning easier and more
            organized.
          </p>
          <button
            className="flex items-center gap-3 text-base self-start text-white
                    font-Inter text-[15px] px-8 py-3 rounded-xl 0 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none
                    bg-gradient-to-r from-[#D67A1E] to-[#CE904E] stats-reveal stats-reveal-up stats-delay-3"
          >
            Learn More
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center my-3 mt-12 px-10 stats-reveal stats-reveal-fade">
        <p className="text-[#D67A1E] font-serif text-xl">Our Departments</p>
        <a
          href="#"
          className="text-gray-500 underline text-sm hover:text-gray-800 transition"
        >
          View All
        </a>
      </div>

      <div className="flex gap-10 px-10 ">
        <div className="w-2/5 flex flex-col justify-start mt-10">
          <h2 className="font-tiro-devanagari text-5xl text-[#1e2a40] leading-tight font-light mb-6 w-5 stats-reveal stats-reveal-left">
            Explore Academic{" "}
            <span className="font-style-script font-light">Programs</span>
          </h2>
          <p className="text-gray-700/80 text-md leading-relaxed mb-6 stats-reveal stats-reveal-left stats-delay-1">
            EDUera offers internationally recognized degrees designed to prepare
            students for both local and global career opportunities. Through
            hands-on learning, practical projects, and industry focused
            curricula, students develop real-world skills that go beyond
            traditional education.<br></br> <br></br> Our programs empower you
            with critical thinking, innovation, and professional experience to
            confidently start your journey toward future success.
          </p>
          <p className="text-[#1e2a40] font-bold text-xl stats-reveal stats-reveal-left stats-delay-2">
            The Future is yours.
          </p>
        </div>

        <div className="w-3/5 grid grid-cols-2 gap-3 mb-20">
          {departments.map((dept, i) => (
            <div
              key={dept.id}
              className={`relative h-64 overflow-hidden rounded-sm group cursor-pointer stats-reveal stats-reveal-scale stats-delay-${i + 1}`}
            >
              <img
                src={dept.image}
                alt={dept.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                <h3 className="text-white font-bold text-xl mb-3">
                  {dept.title}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {dept.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[800px] overflow-hidden">
        <img
          src={camp}
          alt="Campus Life"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-[#180E03]/65" />
        <div className="relative z-10 h-full px-10 py-8">
          <p className="text-white/80 text-sm font-light absolute top-8 left-10 stats-reveal stats-reveal-fade">
            Campus Life
          </p>

          <div className="h-full flex flex-col justify-center max-w-2xl">
            <h2 className="font-serif text-6xl font-normal text-white leading-tight mb-10 stats-reveal stats-reveal-up">
              This is More <br /> than just a <br />
              <span className="text-[#D67A1E]">Portal</span>
            </h2>

            <p className="text-white/60 text-base leading-relaxed stats-reveal stats-reveal-up stats-delay-1">
              Organized communities where each group has its own dedicated
              space, allowing students and instructors to interact within their
              specific academic environment. This structure keeps communication
              focused, reduces distractions, and ensures that discussions remain
              relevant to each course or group.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
