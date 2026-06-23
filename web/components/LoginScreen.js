import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import Toast from "./Toast";

const roleHome = { admin: "/", teacher: "/", student: "/", veli: "/evaluations" };

const PARTICLES = [
  { left: "6%",  top: "14%", sz: 2.5, delay: 0,    dur: 11, c: "#a855f7" },
  { left: "14%", top: "68%", sz: 3,   delay: 1.5,  dur: 9,  c: "#818cf8" },
  { left: "21%", top: "38%", sz: 2,   delay: 3,    dur: 13, c: "#c084fc" },
  { left: "29%", top: "83%", sz: 3.5, delay: 0.8,  dur: 10, c: "#a855f7" },
  { left: "40%", top: "22%", sz: 2.5, delay: 2.2,  dur: 12, c: "#e879f9" },
  { left: "50%", top: "60%", sz: 2,   delay: 4,    dur: 14, c: "#818cf8" },
  { left: "60%", top: "9%",  sz: 3,   delay: 1,    dur: 8,  c: "#fbbf24" },
  { left: "67%", top: "44%", sz: 4,   delay: 2.8,  dur: 16, c: "#a855f7" },
  { left: "76%", top: "76%", sz: 2.5, delay: 0.5,  dur: 11, c: "#c084fc" },
  { left: "86%", top: "27%", sz: 3,   delay: 3.5,  dur: 13, c: "#fbbf24" },
  { left: "93%", top: "61%", sz: 2,   delay: 1.8,  dur: 9,  c: "#818cf8" },
  { left: "4%",  top: "52%", sz: 2,   delay: 2.5,  dur: 12, c: "#e879f9" },
  { left: "33%", top: "50%", sz: 2.5, delay: 4.5,  dur: 10, c: "#a855f7" },
  { left: "54%", top: "89%", sz: 3,   delay: 0.3,  dur: 14, c: "#fbbf24" },
  { left: "74%", top: "17%", sz: 2,   delay: 3.8,  dur: 11, c: "#c084fc" },
  { left: "45%", top: "73%", sz: 3,   delay: 5,    dur: 9,  c: "#818cf8" },
  { left: "89%", top: "46%", sz: 2.5, delay: 1.2,  dur: 13, c: "#a855f7" },
  { left: "17%", top: "91%", sz: 2,   delay: 2,    dur: 10, c: "#c084fc" },
];

const PIANO_BLACK_X = [18, 48, 108, 138, 168, 228, 258, 318, 348, 378];

function ArtIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full"
      style={{ maxWidth: "400px" }}
    >
      <defs>
        <filter id="fGold" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fPurple" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="fPink" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Decorative rings */}
      <circle cx="250" cy="230" r="185" stroke="#7e22ce" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.18" />
      <circle cx="250" cy="230" r="135" stroke="#a855f7" strokeWidth="0.5" opacity="0.1" />

      {/* ── Treble Clef – center, gold, lf1 ── */}
      <g className="lf1" filter="url(#fGold)" opacity="0.93">
        <g transform="translate(184, 22) scale(1.35)">
          <path d="M26 6 L26 238" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M26 6 C26 6 56 16 56 50 C56 82 26 90 16 110 C6 130 16 160 26 168 C48 180 66 165 66 142 C66 120 48 108 26 100"
                stroke="#fbbf24" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <path d="M26 168 C2 175 -6 198 6 215 C16 228 38 228 46 215 C54 202 46 188 26 182"
                stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M26 238 C14 240 2 233 2 220 C2 206 14 200 26 202"
                stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* ── Double beam music note – top-right, lf2 ── */}
      <g className="lf2" filter="url(#fPurple)" opacity="0.88">
        <ellipse cx="372" cy="54" rx="14" ry="9.5" fill="#c084fc" transform="rotate(-18 372 54)" />
        <ellipse cx="400" cy="44" rx="13" ry="9" fill="#c084fc" transform="rotate(-18 400 44)" />
        <line x1="385" y1="49" x2="385" y2="4" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="413" y1="38" x2="413" y2="4" stroke="#c084fc" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="385" y1="4"  x2="413" y2="4"  stroke="#c084fc" strokeWidth="3"   strokeLinecap="round" />
        <line x1="385" y1="14" x2="413" y2="14" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── Single note – left, lf3 ── */}
      <g className="lf3" filter="url(#fPurple)" opacity="0.78">
        <ellipse cx="65" cy="112" rx="12" ry="8.5" fill="#a78bfa" transform="rotate(-15 65 112)" />
        <line x1="76" y1="108" x2="76" y2="66" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
        <path d="M76 66 C86 61 96 69 93 80" stroke="#a78bfa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Eighth note – lf4 ── */}
      <g className="lf4" opacity="0.62">
        <ellipse cx="152" cy="298" rx="9" ry="6.5" fill="#818cf8" transform="rotate(-20 152 298)" />
        <line x1="160" y1="295" x2="160" y2="262" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M160 262 C168 258 176 264 173 273" stroke="#818cf8" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* ── Paint Palette – lower-left, lf6 ── */}
      <g className="lf6" filter="url(#fGold)" opacity="0.85">
        <g transform="translate(28, 252)">
          <path d="M44 2 C67 2 82 20 82 40 C82 60 67 74 50 74 C44 74 40 70 38 64 C30 66 22 62 18 54 C10 60 2 54 2 46 C2 30 10 20 20 14 C28 6 36 2 44 2 Z"
                stroke="#fbbf24" strokeWidth="2" fill="rgba(251,191,36,0.08)" />
          <circle cx="58" cy="54" r="9" fill="none" stroke="#fbbf24" strokeWidth="1.8" opacity="0.45" />
          <circle cx="24" cy="22" r="7" fill="#ef4444" opacity="0.9" />
          <circle cx="42" cy="13" r="7" fill="#f59e0b" opacity="0.9" />
          <circle cx="60" cy="17" r="7" fill="#22c55e" opacity="0.9" />
          <circle cx="70" cy="33" r="7" fill="#3b82f6" opacity="0.9" />
          <circle cx="22" cy="46" r="7" fill="#a855f7" opacity="0.9" />
        </g>
      </g>

      {/* ── Paintbrush – right, lf3 ── */}
      <g className="lf3" filter="url(#fPurple)" opacity="0.82">
        <g transform="translate(368, 158) rotate(-28)">
          <rect x="-4" y="-78" width="8" height="72" rx="4" fill="#c084fc" />
          <rect x="-6" y="-8"  width="12" height="10" rx="2" fill="#7e22ce" />
          <path d="M-6,2 L6,2 L9,34 Q0,47 -2,47 Q-5,47 -9,34 Z" fill="#fbbf24" />
          <path d="M-6,34 Q0,45 -2,47 Q-4,45 -8,34" fill="#f59e0b" opacity="0.7" />
        </g>
        <circle cx="410" cy="196" r="4.5" fill="#fbbf24" opacity="0.48" />
        <circle cx="424" cy="178" r="3"   fill="#f59e0b" opacity="0.32" />
        <circle cx="395" cy="210" r="3"   fill="#fbbf24" opacity="0.28" />
      </g>

      {/* ── Ballet Dancer – left-upper, lf5 ── */}
      <g className="lf5" filter="url(#fPink)" opacity="0.8">
        <g transform="translate(22, 38)">
          <circle cx="56" cy="0"  r="12" fill="#f472b6" />
          <circle cx="56" cy="-10" r="6" fill="#e879f9" opacity="0.65" />
          <path d="M56 12 L56 62" stroke="#e879f9" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M32 52 Q56 38 80 52"  stroke="#a855f7" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M24 64 Q56 44 88 64"  stroke="#a855f7" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M18 74 Q56 50 94 74"  stroke="#a855f7" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.45" />
          <path d="M56 32 L20 18"  stroke="#e879f9" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M56 32 L98 14"  stroke="#e879f9" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M20 18 L13 15"  stroke="#f9a8d4" strokeWidth="2"   strokeLinecap="round" opacity="0.55" />
          <path d="M98 14 L107 10" stroke="#f9a8d4" strokeWidth="2"   strokeLinecap="round" opacity="0.55" />
          <path d="M56 62 L44 108" stroke="#e879f9" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M56 62 L104 84" stroke="#e879f9" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M44 108 L30 116" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M104 84 L120 93" stroke="#f472b6" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>

      {/* ── Ballet Shoes – lower-right, lf4 ── */}
      <g className="lf4" filter="url(#fPink)" opacity="0.73">
        <g transform="translate(345, 328)">
          <path d="M2 24 C2 11 10 0 22 0 L50 0 C58 0 66 9 66 20 C66 28 62 35 55 38 L44 44 L2 44 Z"
                fill="rgba(249,168,212,0.15)" stroke="#f472b6" strokeWidth="2" />
          <path d="M2 35 C8 41 17 46 28 46 L55 38" stroke="#f472b6" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
          <line x1="14" y1="6"  x2="14" y2="40" stroke="#f9a8d4" strokeWidth="0.8" opacity="0.25" />
          <line x1="26" y1="2"  x2="26" y2="43" stroke="#f9a8d4" strokeWidth="0.8" opacity="0.25" />
          <path d="M20 0 C20 0 10 -14 -2 -18" stroke="#f472b6" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M20 0 C20 0 24 -16 34 -19" stroke="#f472b6" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d="M14 30 C14 18 22 7 33 7 L60 7 C68 7 74 15 74 26 C74 34 70 41 63 44"
                stroke="#f472b6" strokeWidth="1.5" fill="none" opacity="0.3" />
        </g>
      </g>

      {/* ── Chess King – right-center, lf2 ── */}
      <g className="lf2" filter="url(#fGold)" opacity="0.87">
        <g transform="translate(318, 218)">
          <rect x="-2"  y="68" width="50" height="11" rx="5"  fill="#f59e0b" />
          <rect x="4"   y="44" width="38" height="26" rx="5"  fill="#fbbf24" opacity="0.9" />
          <rect x="10"  y="28" width="26" height="18" rx="4"  fill="#f59e0b" opacity="0.85" />
          <rect x="18"  y="0"  width="10" height="30" rx="4"  fill="#fbbf24" />
          <rect x="7"   y="8"  width="32" height="11" rx="4"  fill="#fbbf24" />
          <circle cx="23" cy="4"  r="3" fill="#f59e0b" opacity="0.55" />
          <circle cx="23" cy="26" r="3" fill="#f59e0b" opacity="0.45" />
        </g>
      </g>

      {/* ── Sparkles ── */}
      <g className="lf1" opacity="0.72">
        <path d="M430 68 L433 59 L436 68 L445 71 L436 74 L433 83 L430 74 L421 71 Z" fill="#fbbf24" />
      </g>
      <g className="lf3" opacity="0.55">
        <path d="M74 316 L76 309 L78 316 L85 318 L78 321 L76 328 L74 321 L67 318 Z" fill="#c084fc" />
      </g>
      <g className="lf5" opacity="0.48">
        <path d="M450 206 L452 200 L454 206 L460 208 L454 211 L452 217 L450 211 L444 208 Z" fill="#f59e0b" />
      </g>
      <g className="lf2" opacity="0.42">
        <path d="M175 435 L177 428 L179 435 L186 437 L179 440 L177 447 L175 440 L168 437 Z" fill="#a78bfa" />
      </g>
      <g className="lf4" opacity="0.38">
        <path d="M460 140 L461.5 136 L463 140 L467 141.5 L463 143 L461.5 147 L460 143 L456 141.5 Z" fill="#e879f9" />
      </g>

      {/* ── Staff lines ── */}
      <g opacity="0.16">
        {[418, 426, 434, 442].map((y, i) => (
          <line key={i} x1="28" y1={y} x2="472" y2={y} stroke="#9333ea" strokeWidth="1.5" />
        ))}
      </g>

      {/* ── Piano Keys ── */}
      <g transform="translate(40, 452)" opacity="0.48">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={i * 30} y="0" width="27" height="45" rx="3"
                fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
        ))}
        {PIANO_BLACK_X.map((x, i) => (
          <rect key={i} x={x} y="0" width="18" height="28" rx="2.5"
                fill="rgba(20,0,50,0.92)" />
        ))}
      </g>
    </svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login, isAuthenticated, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.must_change_password) {
        router.replace("/change-password");
      } else {
        router.replace(roleHome[currentUser.role] ?? "/");
      }
    }
  }, [currentUser, isAuthenticated, router]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    if (!result.success) { setToast(result.message); return; }
    if (result.user?.must_change_password) {
      router.replace("/change-password");
    } else {
      router.replace(roleHome[result.user?.role] ?? "/");
    }
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(168,85,247,0.7)";
    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.14), inset 0 1px 0 rgba(255,255,255,0.04)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.08)";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      <style>{`
        @keyframes lfFloat {
          0%, 100% { transform: translateY(0px); }
          50%        { transform: translateY(-14px); }
        }
        @keyframes lfFloatB {
          0%, 100% { transform: translateY(0px); }
          50%        { transform: translateY(-9px); }
        }
        @keyframes lfParticle {
          0%   { transform: translateY(0px);   opacity: 0.1; }
          35%  { opacity: 0.6; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes lfOrb {
          0%, 100% { opacity: 0.48; }
          50%       { opacity: 0.76; }
        }
        .lf1 { animation: lfFloat  6s   ease-in-out infinite; }
        .lf2 { animation: lfFloat  8s   ease-in-out infinite 1s; }
        .lf3 { animation: lfFloat  7s   ease-in-out infinite 2s; }
        .lf4 { animation: lfFloatB 9s   ease-in-out infinite 0.5s; }
        .lf5 { animation: lfFloat  5.5s ease-in-out infinite 1.5s; }
        .lf6 { animation: lfFloatB 7.5s ease-in-out infinite 3s; }
        .lp  { animation: lfParticle linear infinite; }
        .lorb { animation: lfOrb 4s ease-in-out infinite; }
        .lbtn {
          background: linear-gradient(135deg, #6d28d9 0%, #9333ea 55%, #a855f7 100%);
          transition: box-shadow 0.28s, transform 0.15s;
        }
        .lbtn:hover:not(:disabled) {
          box-shadow: 0 0 36px rgba(147,51,234,0.68), 0 6px 20px rgba(0,0,0,0.45);
          transform: translateY(-1px);
        }
        .lbtn:active:not(:disabled) { transform: translateY(0px); }
        .linput { transition: border-color 0.2s, box-shadow 0.2s; }
      `}</style>

      <div
        className="relative min-h-screen overflow-hidden text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark purple-tinted overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(155deg, rgba(20,2,40,0.82) 0%, rgba(6,0,15,0.92) 100%)",
            zIndex: 0,
          }}
        />

        {/* ── Floating particles ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="lp absolute rounded-full"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.sz}px`,
                height: `${p.sz}px`,
                backgroundColor: p.c,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>

        {/* ── Layout ── */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 md:py-10">
          <div
            className="grid w-full overflow-hidden rounded-[2.5rem] md:grid-cols-[1.15fr_0.85fr]"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            {/* ─── LEFT ─── */}
            <div className="relative flex flex-col justify-between overflow-hidden p-8 md:p-12">

              {/* Dot grid */}
              <div className="pointer-events-none absolute inset-0">
                <svg className="h-full w-full" style={{ opacity: 0.055 }}>
                  <defs>
                    <pattern id="lpdots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="#c084fc" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lpdots)" />
                </svg>
              </div>

              {/* Glow orb */}
              <div
                className="lorb pointer-events-none absolute"
                style={{
                  top: "32%",
                  left: "28%",
                  width: "520px",
                  height: "520px",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(109,40,217,0.08) 48%, transparent 70%)",
                  filter: "blur(52px)",
                }}
              />

              {/* Text */}
              <div className="relative z-10">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.52em]"
                  style={{ color: "#fbbf24" }}
                >
                  MEB Özel Etimesgut
                </p>
                <div
                  className="mt-2.5 h-px w-14"
                  style={{
                    background:
                      "linear-gradient(90deg, #fbbf24 0%, rgba(251,191,36,0) 100%)",
                  }}
                />
                <h1
                  className="mt-4 text-3xl font-extrabold leading-tight md:text-[2.65rem]"
                  style={{ textShadow: "0 0 50px rgba(168,85,247,0.42)" }}
                >
                  Rezonans
                  <br />
                  <span style={{ color: "#c084fc" }}>Sanat</span>{" "}
                  <span style={{ color: "rgba(255,255,255,0.78)" }}>ve</span>
                  <br />
                  Kişisel Gelişim
                </h1>
                <p className="mt-4 text-sm tracking-wide" style={{ color: "#64748b" }}>
                  Müzik &nbsp;·&nbsp; Resim &nbsp;·&nbsp; Dans &nbsp;·&nbsp; Akıl Oyunları
                </p>
              </div>

              {/* Illustration */}
              <div className="relative z-10 flex justify-center py-4 md:py-6">
                <ArtIllustration />
              </div>

              <div />
            </div>

            {/* ─── RIGHT: form ─── */}
            <div
              className="relative flex items-center justify-center p-6 md:p-10"
              style={{ background: "rgba(0,0,0,0.48)" }}
            >
              {/* Subtle top-center glow inside panel */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.09) 0%, transparent 58%)",
                }}
              />

              <div className="relative w-full" style={{ maxWidth: "356px" }}>
                {/* Glass card */}
                <div
                  className="rounded-[1.75rem] p-7 md:p-8"
                  style={{
                    background: "rgba(255,255,255,0.042)",
                    backdropFilter: "blur(28px)",
                    WebkitBackdropFilter: "blur(28px)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    boxShadow:
                      "0 0 90px rgba(139,92,246,0.1), 0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Logo emblem */}
                  <div className="mb-6 flex justify-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        background: "linear-gradient(140deg, #6d28d9, #9333ea)",
                        boxShadow:
                          "0 0 30px rgba(147,51,234,0.58), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
                        <ellipse
                          cx="9" cy="22" rx="6" ry="4.2"
                          fill="white" opacity="0.95"
                          transform="rotate(-15 9 22)"
                        />
                        <line
                          x1="14.5" y1="18.5" x2="14.5" y2="5.5"
                          stroke="white" strokeWidth="2.6" strokeLinecap="round"
                        />
                        <line
                          x1="14.5" y1="5.5" x2="24.5" y2="9"
                          stroke="white" strokeWidth="2.6" strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Heading */}
                  <p
                    className="text-center text-[10px] font-bold uppercase tracking-[0.38em]"
                    style={{ color: "#fbbf24" }}
                  >
                    Öğrenci Portalı
                  </p>
                  <h2 className="mt-2 text-center text-[1.55rem] font-bold text-white leading-tight">
                    Giriş Yap
                  </h2>
                  <p className="mt-1.5 text-center text-xs" style={{ color: "#475569" }}>
                    Hesabınıza güvenli erişim sağlayın
                  </p>

                  {/* Thin divider */}
                  <div
                    className="mx-auto my-5 h-px"
                    style={{
                      width: "60%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                    }}
                  />

                  {/* Toast */}
                  <Toast
                    message={toast}
                    tone={toast === "Giriş başarılı." ? "success" : "error"}
                  />

                  {/* Form */}
                  <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <label className="block">
                      <span
                        className="mb-2 block text-[11px] font-semibold uppercase tracking-widest"
                        style={{ color: "#64748b" }}
                      >
                        E-posta
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="linput"
                        style={{
                          display: "block",
                          width: "100%",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.05)",
                          color: "white",
                          padding: "13px 16px",
                          fontSize: "0.875rem",
                          outline: "none",
                        }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="ornek@rezonans.com"
                        autoComplete="email"
                        required
                      />
                    </label>

                    <label className="block">
                      <span
                        className="mb-2 block text-[11px] font-semibold uppercase tracking-widest"
                        style={{ color: "#64748b" }}
                      >
                        Şifre
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="linput"
                        style={{
                          display: "block",
                          width: "100%",
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.05)",
                          color: "white",
                          padding: "13px 16px",
                          fontSize: "0.875rem",
                          outline: "none",
                        }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        placeholder="Şifrenizi girin"
                        autoComplete="current-password"
                        required
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="lbtn mt-2 w-full rounded-[14px] py-3.5 text-sm font-bold tracking-wide text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
                    </button>
                  </form>

                  <p
                    className="mt-6 text-center text-[11px]"
                    style={{ color: "#1e293b" }}
                  >
                    Rezonans Sanat Merkezi © 2026
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
