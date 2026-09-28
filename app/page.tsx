"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const EASE = [0.76, 0, 0.24, 1] as const;
const OUT = [0.16, 1, 0.3, 1] as const;

/* ---------- primitivas ---------- */

function Mask({
  children,
  delay = 0,
  load = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  load?: boolean;
  className?: string;
}) {
  const trigger = load
    ? { animate: { y: 0 } }
    : { whileInView: { y: 0 }, viewport: { once: true, amount: 0.6 } };
  return (
    <span className="-my-[0.12em] block overflow-hidden py-[0.12em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "110%" }}
        {...trigger}
        transition={{ duration: 1.1, ease: OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const Tag = ({ n, t, className = "" }: { n: string; t: string; className?: string }) => (
  <h2 className={`font-mono text-[11px] uppercase tracking-[0.22em] ${className}`}>
    <span className="opacity-50">{n}</span> / {t}
  </h2>
);

function Cross({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute size-4 ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px bg-bone/25" />
      <span className="absolute left-0 top-1/2 h-px w-full bg-bone/25" />
    </span>
  );
}

/* ---------- cursor + cabeçalho ---------- */

function Cursor() {
  const [on, setOn] = useState(false);
  const [st, setSt] = useState<"d" | "h" | "c">("d");
  const [dark, setDark] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 45, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 45, mass: 0.35 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as Element;
      setSt(t.closest("a,button,[data-hover]") ? "h" : "d");
      setDark(!!t.closest('[data-tone="light"]'));
    };
    const down = () => setSt("c");
    const up = () => setSt("d");
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[100]">
      <motion.div
        animate={{ scale: st === "h" ? 4.2 : st === "c" ? 0.5 : 1 }}
        transition={{ duration: 0.45, ease: OUT }}
        className={`-ml-[6px] -mt-[6px] size-3 rounded-full transition-colors duration-300 ${
          st === "h" ? "border border-current bg-transparent" : "bg-current"
        } ${dark ? "text-ink" : "text-bone"}`}
      />
    </motion.div>
  );
}

function Header() {
  const { scrollYProgress } = useScroll();
  const pct = useRef<HTMLSpanElement>(null);
  const [light, setLight] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pct.current) pct.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
    let l = false;
    document.querySelectorAll("[data-tone=light]").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < 28 && r.bottom > 28) l = true;
    });
    setLight(l);
  });
  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-between px-5 py-4 font-mono text-[11px] tracking-[0.2em] transition-colors duration-500 md:px-8 ${
        light ? "text-ink" : "text-bone"
      }`}
    >
      <span className="font-sans text-sm font-black tracking-tight">COMEÇA.</span>
      <span>
        <span className="hidden sm:inline">LUANDA 8.84°S 13.23°E — </span>
        <span ref={pct}>000</span>
      </span>
    </header>
  );
}

/* ---------- 01 · hero ---------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(p, [0, 1], ["0%", "14%"]);
  const gy = useTransform(p, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(p, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-20 md:px-8">
      <motion.div style={{ y: gy }} aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-[0.08] [mask-image:radial-gradient(circle_at_72%_42%,black,transparent_70%)]">
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="#ecebe6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -right-[14vw] top-[10vh] size-[48vw] rounded-full border border-bone/10" />
        <div className="absolute right-[6vw] top-[24vh] size-[14vw] rounded-full border border-bone/10" />
        <Cross className="left-[12vw] top-[30vh]" />
        <Cross className="right-[18vw] bottom-[26vh]" />
        <span className="absolute right-5 top-[46%] hidden font-mono text-[10px] tracking-[0.2em] text-bone/25 md:right-8 md:block [writing-mode:vertical-rl]">
          T + 00:00:00 · SEM COMEÇO
        </span>
      </motion.div>

      <div className="relative flex items-center gap-4">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 1.3, ease: EASE }}
          className="block h-px w-16 origin-left bg-bone/40"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="font-mono text-[11px] uppercase tracking-[0.22em]"
        >
          01 / PROCRASTINATION
        </motion.p>
      </div>

      <motion.h1
        style={{ y, opacity: fade }}
        aria-label="Estás a adiar."
        className="relative font-black uppercase leading-[0.8] tracking-[-0.06em]"
      >
        <span aria-hidden className="block">
          <Mask load delay={1.1} className="pl-[0.5vw] text-[min(8.5vw,15vh)] font-medium tracking-[-0.03em]">
            ESTÁS A
          </Mask>
          <Mask load delay={1.45} className="text-[min(21vw,46vh)]">
            ADIAR.
          </Mask>
        </span>
      </motion.h1>

      <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md text-lg leading-snug md:text-xl">
          <Mask load delay={2.1} className="text-bone/55">
            Talvez o problema não seja falta de tempo.
          </Mask>
          <Mask load delay={2.35}>Talvez seja o primeiro passo.</Mask>
        </div>
        <motion.a
          href="#comeca"
          data-hover
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.9, duration: 1 }}
          className="group inline-flex items-center gap-4 text-2xl font-black tracking-tight"
        >
          COMEÇA.
          <span className="block h-px w-12 bg-bone transition-all duration-500 [transition-timing-function:cubic-bezier(.76,0,.24,1)] group-hover:w-24" />
        </motion.a>
      </div>
    </section>
  );
}

/* ---------- 02 · o ciclo ---------- */

const CYCLE = [
  ["AMANHÃ.", "left-[6vw] top-[14svh]", -1],
  ["DEPOIS.", "right-[6vw] top-[34svh]", 1],
  ["MAIS TARDE.", "left-[6vw] md:left-[14vw] top-[54svh]", -1],
  ["NUNCA.", "right-[6vw] bottom-[9svh]", 1],
] as const;
const BIG = "text-[clamp(3rem,15vw,15rem)] font-black uppercase leading-[0.85] tracking-[-0.055em]";

function CycleWord({ p, i, dir, pos, children }: { p: MotionValue<number>; i: number; dir: number; pos: string; children: ReactNode }) {
  const s = i / 4;
  const opacity = useTransform(
    p,
    i < 3 ? [s, s + 0.12, s + 0.25, s + 0.37] : [s, s + 0.12],
    i < 3 ? [0, 1, 1, 0.14] : [0, 1],
  );
  const x = useTransform(p, [s, s + 0.16], [`${dir * 12}vw`, "0vw"]);
  return (
    <motion.p style={{ opacity, x }} className={`absolute max-w-[88vw] ${pos} ${BIG}`}>
      {children}
    </motion.p>
  );
}

function Cycle() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  if (reduce)
    return (
      <section ref={ref} className="space-y-4 px-5 py-24 md:px-8">
        <Tag n="02" t="O CICLO" className="mb-8" />
        {CYCLE.map(([w]) => (
          <p key={w} className={BIG}>{w}</p>
        ))}
      </section>
    );
  return (
    <section ref={ref} className="relative h-[420svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {CYCLE.map(([w, pos, dir], i) => (
          <CycleWord key={w} p={p} i={i} dir={dir} pos={pos}>{w}</CycleWord>
        ))}
        <Tag n="02" t="O CICLO" className="absolute bottom-6 left-5 md:left-8" />
        <motion.span style={{ scaleX: p }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/40" />
      </div>
    </section>
  );
}

/* ---------- 03 · o tempo ---------- */

const TIMES = [
  ["23:47", "Vou começar amanhã."],
  ["00:12", "Ainda tenho tempo."],
  ["01:36", "Agora já não."],
] as const;

function Time() {
  return (
    <section className="relative px-5 py-[20svh] md:px-8">
      <Tag n="03" t="O TEMPO" className="mb-16" />
      {TIMES.map(([t, s], i) => (
        <div
          key={t}
          style={{ opacity: 1 - i * 0.25 }}
          className="relative grid items-end gap-3 py-8 md:grid-cols-[1fr_auto] md:gap-12"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.5, ease: EASE }}
            className="absolute inset-x-0 top-0 h-px origin-left bg-bone/30"
          />
          <div aria-label={t} className="flex text-[clamp(4.5rem,22vw,20rem)] font-light leading-[0.85] tracking-[-0.05em] tabular-nums">
            {[...t].map((c, k) => (
              <Mask key={k} delay={k * 0.08}>{c}</Mask>
            ))}
          </div>
          <div className="text-lg md:pb-[1.6vw] md:text-2xl">
            <Mask delay={0.5}>{s}</Mask>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ---------- 04 · a tarefa ---------- */

const CHAOS = [
  ["E SE?", 8, 8, 9, -6],
  ["AINDA NÃO", 58, 5, 7, 4],
  ["PRIMEIRO ISTO", 3, 28, 11, 3],
  ["PERFEITO?", 50, 24, 13, -3],
  ["DEPOIS", 66, 44, 10, 8],
  ["PRECISO DE MAIS", 4, 50, 8, -4],
  ["E SE FALHAR?", 34, 62, 12, 5],
  ["NÃO ESTÁ PRONTO", 52, 78, 7, -2],
  ["MAIS UM POUCO", 3, 82, 9, 2],
  ["É SÓ UMA COISA.", 26, 40, 15, -8],
] as const;

function Chaos({ p, i, d }: { p: MotionValue<number>; i: number; d: (typeof CHAOS)[number] }) {
  const a = 0.3 + i * 0.03;
  const opacity = useTransform(p, [a, a + 0.06], [0, i % 3 === 0 ? 0.95 : 0.5]);
  const scale = useTransform(p, [a, 0.76], [0.7, 1.25]);
  const x = useTransform(p, [0.3, 0.76], ["0vw", `${i % 2 ? -6 : 6}vw`]);
  return (
    <motion.span
      style={{ opacity, scale, x, left: `${d[1]}%`, top: `${d[2]}%`, rotate: d[4], fontSize: `clamp(1.1rem,${d[3]}vw,14rem)` }}
      className={`absolute whitespace-nowrap font-black uppercase leading-none tracking-[-0.04em] ${i % 4 === 1 ? "text-transparent [-webkit-text-stroke:1px_#ecebe6]" : ""}`}
    >
      {d[0]}
    </motion.span>
  );
}

function Task() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const main = useTransform(p, [0, 0.05, 0.3, 0.6], [0, 1, 1, 0.12]);
  const sub1 = useTransform(p, [0.14, 0.22], [0, 1]);
  const sub2 = useTransform(p, [0.3, 0.38], [0, 1]);
  const all = useTransform(p, [0.76, 0.92], [1, 0]);
  const HEAD = "text-[clamp(3rem,15vw,15rem)] font-black uppercase leading-[0.85] tracking-[-0.055em]";
  if (reduce)
    return (
      <section ref={ref} className="space-y-6 px-5 py-24 md:px-8">
        <Tag n="04" t="A TAREFA" />
        <p className={HEAD}>É só uma coisa.</p>
        <p className="text-xl">Mas na tua cabeça...</p>
        <p className="text-xl">Tornou-se dez.</p>
      </section>
    );
  return (
    <section ref={ref} className="relative h-[380svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ opacity: all }} className="absolute inset-0">
          <motion.p style={{ opacity: main }} className={`absolute left-5 top-[22svh] max-w-[90vw] md:left-8 ${HEAD}`}>
            É SÓ UMA <br /> COISA.
          </motion.p>
          {CHAOS.map((d, i) => (
            <Chaos key={d[0]} p={p} i={i} d={d} />
          ))}
          <motion.p style={{ opacity: sub1 }} className="absolute bottom-[16svh] left-5 text-lg md:left-8 md:text-2xl">
            Mas na tua cabeça...
          </motion.p>
          <motion.p style={{ opacity: sub2 }} className="absolute bottom-[10svh] left-5 text-lg font-bold md:left-8 md:text-2xl">
            Tornou-se dez.
          </motion.p>
        </motion.div>
        <Tag n="04" t="A TAREFA" className="absolute bottom-6 right-5 md:right-8" />
      </div>
    </section>
  );
}

/* ---------- 05 · silêncio ---------- */

const QUIET = ["Respira.", "Agora.", "COMEÇA."];

function Silence() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.6, once: true });
  const reduce = useReducedMotion();
  const [s, setS] = useState(-1);
  useEffect(() => {
    if (!seen) return;
    if (reduce) return setS(2);
    setS(0);
    const a = setTimeout(() => setS(1), 3200);
    const b = setTimeout(() => setS(2), 5400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [seen, reduce]);
  return (
    <section className="relative h-[140svh]">
      <div ref={ref} className="sticky top-0 grid h-[100svh] place-items-center px-5">
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={seen ? { scaleY: 1 } : {}}
          transition={{ duration: 2.4, ease: EASE }}
          className="absolute left-1/2 top-0 h-[18svh] w-px origin-top bg-bone/25"
        />
        <AnimatePresence mode="wait">
          {s >= 0 && (
            <motion.p
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: OUT }}
              className={
                s === 2
                  ? "text-[clamp(2.5rem,9vw,8rem)] font-black tracking-[-0.05em]"
                  : "text-[clamp(1.5rem,3.2vw,2.75rem)] font-light tracking-[-0.02em]"
              }
            >
              {QUIET[s]}
            </motion.p>
          )}
        </AnimatePresence>
        <Tag n="05" t="SILÊNCIO" className="absolute bottom-6 left-5 opacity-60 md:left-8" />
      </div>
    </section>
  );
}

/* ---------- 06 · a viragem + 07 · final ---------- */

function StartButton({ onStart }: { onStart: () => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18 });
  const sy = useSpring(my, { stiffness: 220, damping: 18 });
  return (
    <motion.button
      type="button"
      data-hover
      onClick={onStart}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left - r.width / 2) * 0.12);
        my.set((e.clientY - r.top - r.height / 2) * 0.2);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="group relative overflow-hidden border-2 border-ink px-6 py-5 text-left md:px-12 md:py-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="relative flex items-center gap-3 whitespace-nowrap text-[clamp(1.4rem,6.2vw,5.5rem)] font-black leading-none tracking-[-0.04em] text-ink transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent group-focus-visible:text-accent">
        COMEÇA AGORA
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-3">→</span>
      </span>
      <span
        aria-hidden
        className="absolute right-3 top-2 translate-y-1 font-mono text-[10px] tracking-[0.2em] text-accent opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
      >
        CLICA
      </span>
    </motion.button>
  );
}

function TurnFinal() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setOn(false), 3200);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOn(false);
    window.addEventListener("keydown", k);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", k);
    };
  }, [on]);
  return (
    <div id="comeca" data-tone="light" className="relative text-ink">
      <motion.div
        aria-hidden
        initial={{ clipPath: "circle(0% at 50% 22%)" }}
        whileInView={{ clipPath: "circle(150% at 50% 22%)" }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 bg-accent"
      />
      <section className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-10 pt-24 md:px-8">
        <Tag n="06" t="A VIRAGEM" />
        <p className="font-black uppercase leading-[0.8] tracking-[-0.06em] text-[min(17vw,27vh)]">
          <Mask delay={0.6}>CHEGA</Mask>
          <Mask delay={0.75}>DE</Mask>
          <Mask delay={0.9}>ESPERAR.</Mask>
        </p>
        <div className="text-xl leading-snug md:text-3xl">
          <Mask delay={1.1}>Não precisas de terminar.</Mask>
          <Mask delay={1.25} className="font-black">Precisas de começar.</Mask>
        </div>
      </section>
      <section className="relative flex min-h-[90svh] flex-col items-start justify-center gap-10 px-5 pb-16 md:px-8">
        <Tag n="07" t="FINAL" />
        <StartButton onStart={() => setOn(true)} />
        <p className="max-w-xs text-lg leading-snug">Uma coisa. Só uma. Agora.</p>
      </section>

      <AnimatePresence>
        {on && (
          <motion.div
            role="status"
            onClick={() => setOn(false)}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="fixed inset-0 z-[90] grid place-items-center bg-ink px-5 text-accent"
            data-tone="dark"
          >
            <p className="text-[min(18vw,30vh)] font-black uppercase leading-[0.8] tracking-[-0.06em]">
              <Mask load delay={0.5}>COMEÇOU.</Mask>
            </p>
            <span className="absolute bottom-6 font-mono text-[11px] tracking-[0.2em] text-bone/50">ESC PARA VOLTAR</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- 08 · footer ---------- */

function Footer() {
  return (
    <footer className="flex flex-col gap-2 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:justify-between md:px-8">
      <span className="font-sans text-base font-black normal-case tracking-tight">COMEÇA.</span>
      <span>Uma coisa de cada vez.</span>
      <span>2026</span>
    </footer>
  );
}

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Cycle />
        <Time />
        <Task />
        <Silence />
        <TurnFinal />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </MotionConfig>
  );
}
