import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Shared Animation Config ─── */
const ease = [0.32, 0.72, 0, 1] as [number, number, number, number];
const t = { type: "tween" as const, ease, duration: 0.45 };
const pageV = { enter: { opacity: 0, y: 20 }, center: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

/* ─── Small reusable pieces ─── */
const Dots = ({ total, current }: { total: number; current: number }) => (
  <div className="flex items-center justify-center gap-2 py-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i < current ? "bg-primary scale-110" : "bg-border"}`} />
    ))}
  </div>
);

const Bubble = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t, delay }}
    className="cloud-shadow rounded-2xl bg-card/80 px-5 py-4 backdrop-blur-sm">
    <p className="justified-text text-foreground">{children}</p>
  </motion.div>
);

const Btn = ({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick: () => void; variant?: "primary" | "secondary" | "ghost" }) => {
  const styles = {
    primary: "bg-gradient-to-r from-accent-lavender to-accent-pink text-foreground cloud-shadow",
    secondary: "bg-card/80 text-foreground cloud-shadow",
    ghost: "text-muted-foreground",
  };
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick}
      className={`w-full rounded-2xl px-6 py-4 text-[0.95rem] font-medium transition-all duration-200 justified-text ${styles[variant]}`}>
      {children}
    </motion.button>
  );
};

const Opt = ({ label, selected, onClick, delay = 0, multi }: {
  label: string; selected?: boolean; onClick: () => void; delay?: number; multi?: boolean;
}) => (
  <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t, delay }}
    whileTap={{ scale: 0.98 }} onClick={onClick}
    className={`w-full rounded-2xl px-5 py-3.5 text-left transition-all duration-200 justified-text ${
      selected ? "bg-gradient-to-r from-accent-lavender to-accent-pink shadow-sm" : "cloud-shadow bg-card/80"
    }`}>
    <span className="text-foreground text-[0.95rem]">
      {multi && <span className={`mr-2.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded align-middle text-xs leading-none ${selected ? "bg-primary/30" : "border border-border"}`}>{selected ? "✓" : ""}</span>}
      {label}
    </span>
  </motion.button>
);

/* ─── Types ─── */
interface Answers { [k: string]: string | string[] | number }
interface ScreenProps { answers: Answers; setAnswer: (k: string, v: string | number) => void; revealStep: number; onNext: () => void }
interface MultiProps extends ScreenProps { toggleMulti: (k: string, v: string) => void }

/* ─── Main Component ─── */
const ExploreIdentity = () => {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [revealStep, setRevealStep] = useState(0);

  const next = useCallback(() => { setScreen(s => s + 1); setRevealStep(0); }, []);
  const setAnswer = useCallback((k: string, v: string | number) => {
    setAnswers(a => ({ ...a, [k]: v }));
    setTimeout(() => setRevealStep(s => s + 1), 400);
  }, []);
  const toggleMulti = useCallback((k: string, v: string) => {
    setAnswers(a => {
      const c = (a[k] as string[]) || [];
      return { ...a, [k]: c.includes(v) ? c.filter(x => x !== v) : [...c, v] };
    });
  }, []);

  const screens = [
    <S0 key={0} onNext={next} />,
    <S1 key={1} onNext={next} />,
    <S2 key={2} {...{ answers, setAnswer, revealStep, onNext: next }} />,
    <S3 key={3} {...{ answers, setAnswer, revealStep, onNext: next, toggleMulti }} />,
    <S4 key={4} {...{ answers, setAnswer, revealStep, onNext: next }} />,
    <S5 key={5} {...{ answers, setAnswer, revealStep, onNext: next }} />,
    <S6 key={6} {...{ answers, setAnswer, revealStep, onNext: next }} />,
    <S7 key={7} onNext={next} />,
    <S8 key={8} onNext={next} />,
    <S9 key={9} {...{ answers, setAnswer, revealStep, onNext: next }} />,
    <S10 key={10} />,
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={screen} variants={pageV} initial="enter" animate="center" exit="exit" transition={t} className="flex flex-1 flex-col">
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─── SCREEN 0: Welcome ─── */
const S0 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 py-12"
    style={{ background: "radial-gradient(circle at 50% 40%, hsl(25 60% 94%), hsl(30 20% 98%))" }}>
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={t} className="w-full">
      <p className="text-5xl mb-4 text-center">🌱</p>
      <h1 className="text-2xl font-semibold text-foreground mb-4 text-center" style={{ letterSpacing: "-0.02em" }}>
        Explore Your Identity
      </h1>
      <p className="justified-text text-foreground/80 text-base mb-2 px-2">
        A gentle space to reflect on how you experience your gender. No pressure. No labels. Just you.
      </p>
      <p className="text-sm text-muted-foreground mt-3 justified-text px-2">⏱ Takes about 3–5 minutes</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t, delay: 0.3 }} className="mt-10 w-full">
      <Btn onClick={onNext}>Start</Btn>
    </motion.div>
  </div>
);

/* ─── SCREEN 1: Comfort Note ─── */
const S1 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t}
      className="cloud-shadow rounded-3xl bg-card/80 p-8 backdrop-blur-sm w-full">
      <p className="justified-text text-foreground text-base leading-relaxed">
        You can skip anything. Take your time—this is for you.
      </p>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.4 }} className="mt-8 w-full">
      <Btn onClick={onNext}>Continue</Btn>
    </motion.div>
  </div>
);

/* ─── SCREEN 2: Identity ─── */
const S2 = ({ answers, setAnswer, revealStep, onNext }: ScreenProps) => {
  const q1 = ["Comfortable", "Unsure / questioning", "Disconnected", "Exploring", "Something else"];
  const q2 = ["Yes, mostly", "Sometimes", "Not really", "Not at all", "I'm not sure"];
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <Dots total={5} current={1} />
      <div className="mt-6 flex flex-col gap-4">
        <Bubble>Let&apos;s start with how you feel inside.</Bubble>
        <Bubble delay={0.15}>How do you currently feel about your gender?</Bubble>
        <div className="mt-2 flex flex-col gap-2.5">
          {q1.map((o, i) => <Opt key={o} label={o} delay={0.2 + i * 0.04} selected={answers.id_feel === o} onClick={() => setAnswer("id_feel", o)} />)}
        </div>
        {answers.id_feel && revealStep >= 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t} className="mt-4 flex flex-col gap-4">
            <Bubble>Do you feel connected to the gender you were assigned at birth?</Bubble>
            <div className="mt-2 flex flex-col gap-2.5">
              {q2.map((o, i) => <Opt key={o} label={o} delay={0.05 + i * 0.04} selected={answers.id_conn === o} onClick={() => setAnswer("id_conn", o)} />)}
            </div>
          </motion.div>
        )}
        {answers.id_conn && revealStep >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.2 }} className="mt-6">
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN 3: Expression ─── */
const S3 = ({ answers, setAnswer, toggleMulti, revealStep, onNext }: MultiProps) => {
  const val = (answers.expr_slider as number) ?? 50;
  const opts = ["Clothing", "Name", "Pronouns", "Appearance", "Not sure yet", "Other"];
  const selected = ((answers.expr_explore as string[]) || []);
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <Dots total={5} current={2} />
      <div className="mt-6 flex flex-col gap-4">
        <Bubble>Now, let&apos;s look at how you express yourself.</Bubble>
        <Bubble delay={0.15}>What kind of expression feels most like you?</Bubble>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t, delay: 0.25 }}
          className="cloud-shadow mt-2 rounded-2xl bg-card/80 p-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-3">
            <span className="justified-text">Feminine</span><span className="justified-text">Androgynous</span><span className="justified-text">Masculine</span>
          </div>
          <input type="range" min="0" max="100" value={val}
            onChange={e => setAnswer("expr_slider", Number(e.target.value))}
            className="w-full" style={{ background: "linear-gradient(to right, #FBCFE8, #C7D2FE, #E0E7FF)" }} />
        </motion.div>
        {answers.expr_slider !== undefined && revealStep >= 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t} className="mt-4 flex flex-col gap-4">
            <Bubble>What are you curious to explore?</Bubble>
            <p className="text-xs text-muted-foreground px-1 justified-text">Select all that apply</p>
            <div className="flex flex-col gap-2.5">
              {opts.map((o, i) => <Opt key={o} label={o} delay={0.05 + i * 0.04} multi selected={selected.includes(o)} onClick={() => toggleMulti("expr_explore", o)} />)}
            </div>
          </motion.div>
        )}
        {selected.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.2 }} className="mt-6">
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN 4: Social ─── */
const S4 = ({ answers, setAnswer, revealStep, onNext }: ScreenProps) => {
  const q1 = ["Alone", "With close friends", "With family", "Online", "Public spaces"];
  const q2 = ["Often", "Sometimes", "Rarely", "Never"];
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <Dots total={5} current={3} />
      <div className="mt-6 flex flex-col gap-4">
        <Bubble>Different spaces can feel different.</Bubble>
        <Bubble delay={0.15}>Where do you feel most like yourself?</Bubble>
        <div className="mt-2 flex flex-col gap-2.5">
          {q1.map((o, i) => <Opt key={o} label={o} delay={0.2 + i * 0.04} selected={answers.soc_where === o} onClick={() => setAnswer("soc_where", o)} />)}
        </div>
        {answers.soc_where && revealStep >= 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t} className="mt-4 flex flex-col gap-4">
            <Bubble>Do you ever feel like you&apos;re &ldquo;pretending&rdquo;?</Bubble>
            <div className="flex flex-col gap-2.5">
              {q2.map((o, i) => <Opt key={o} label={o} delay={0.05 + i * 0.04} selected={answers.soc_pretend === o} onClick={() => setAnswer("soc_pretend", o)} />)}
            </div>
          </motion.div>
        )}
        {answers.soc_pretend && revealStep >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.2 }} className="mt-6">
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN 5: Dysphoria ─── */
const S5 = ({ answers, setAnswer, revealStep, onNext }: ScreenProps) => {
  const q1 = ["Often", "Sometimes", "Rarely", "Never", "Not sure"];
  const q2 = ["Mirror / appearance", "Being addressed a certain way", "Social situations", "Body-related changes", "Not sure", "Other"];
  const [pauseDone, setPauseDone] = useState(false);
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <Dots total={5} current={4} />
      <div className="mt-6 flex flex-col gap-4">
        <Bubble>Some people experience moments of discomfort around their body or how others see them. You can skip this if it doesn&apos;t feel right.</Bubble>
        <Bubble delay={0.15}>Do you experience this kind of discomfort?</Bubble>
        <div className="mt-2 flex flex-col gap-2.5">
          {q1.map((o, i) => <Opt key={o} label={o} delay={0.2 + i * 0.04} selected={answers.dys_feel === o} onClick={() => setAnswer("dys_feel", o)} />)}
        </div>
        {answers.dys_feel && revealStep >= 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t} className="mt-4 flex flex-col gap-4">
            <Bubble>When does this usually happen?</Bubble>
            <div className="flex flex-col gap-2.5">
              {q2.map((o, i) => <Opt key={o} label={o} delay={0.05 + i * 0.04} selected={answers.dys_when === o} onClick={() => setAnswer("dys_when", o)} />)}
            </div>
          </motion.div>
        )}
        {answers.dys_when && revealStep >= 2 && !pauseDone && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t}
            className="mt-6 cloud-shadow rounded-3xl bg-card/80 p-6">
            <p className="justified-text text-foreground mb-4">Thanks for sharing that. Take a moment if you need.</p>
            <Btn onClick={() => { setPauseDone(true); onNext(); }}>Continue</Btn>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN 6: Euphoria ─── */
const S6 = ({ answers, setAnswer, onNext }: ScreenProps) => {
  const opts = ["Expressing myself freely", "When others see me how I feel", "In certain clothes/styles", "When I'm alone", "Still figuring it out", "Other"];
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <Dots total={5} current={5} />
      <div className="mt-6 flex flex-col gap-4">
        <Bubble>Let&apos;s also notice the moments that feel right.</Bubble>
        <Bubble delay={0.15}>When do you feel most like yourself?</Bubble>
        <div className="mt-2 flex flex-col gap-2.5">
          {opts.map((o, i) => <Opt key={o} label={o} delay={0.2 + i * 0.04} selected={answers.euph === o} onClick={() => setAnswer("euph", o)} />)}
        </div>
        {answers.euph && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.3 }} className="mt-6">
            <Btn onClick={onNext}>Continue</Btn>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* ─── SCREEN 7: Reflection Pause ─── */
const S7 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={t} className="w-full text-center">
      <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-accent-lavender to-accent-pink animate-breathe" />
      <p className="justified-text text-foreground text-base px-2">
        Thank you for sharing all of this. Let&apos;s reflect on what this might mean for you.
      </p>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.6 }} className="mt-10 w-full">
      <Btn onClick={onNext}>Continue</Btn>
    </motion.div>
  </div>
);

/* ─── SCREEN 8: Results ─── */
const S8 = ({ onNext }: { onNext: () => void }) => {
  const cards = [
    { icon: "🌈", title: "Identity", text: "You may be exploring your gender and what feels right for you." },
    { icon: "🎨", title: "Expression", text: "You seem drawn to expressions that help you feel more like yourself." },
    { icon: "💭", title: "Comfort", text: "You feel most at ease in spaces where you feel safe and accepted." },
    { icon: "⚖️", title: "Discomfort", text: "Some situations may bring moments of unease or disconnection." },
    { icon: "💖", title: "Affirming Moments", text: "You feel most aligned when you can express yourself freely." },
  ];
  return (
    <div className="flex flex-1 flex-col py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t} className="text-center mb-6 px-5">
        <p className="text-3xl mb-2">✨</p>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Your Gender Expression Profile</h2>
        <p className="text-sm text-muted-foreground mt-1 justified-text px-2">This isn&apos;t a label—just a reflection of what you shared.</p>
      </motion.div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-5 no-scrollbar">
        {cards.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...t, delay: 0.1 + i * 0.08 }}
            className="cloud-shadow min-w-[80vw] max-w-[340px] snap-center rounded-3xl bg-card/80 p-8 flex-shrink-0">
            <p className="text-3xl mb-3">{c.icon}</p>
            <h3 className="font-semibold text-foreground mb-2 justified-text">{c.title}</h3>
            <p className="justified-text text-foreground/80 text-sm">{c.text}</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.6 }} className="mt-6 px-5">
        <Btn onClick={onNext}>Continue</Btn>
      </motion.div>
    </div>
  );
};

/* ─── SCREEN 9: Suggestions ─── */
const S9 = ({ answers, setAnswer, onNext }: ScreenProps) => {
  const tips = ["Trying small changes in safe spaces", "Journaling your feelings", "Experimenting privately with expression", "Talking to someone you trust"];
  const steps = ["Try a small change privately", "Reflect in a journal", "Just sit with these thoughts", "Maybe later"];
  return (
    <div className="flex flex-1 flex-col px-5 py-8 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t}>
        <p className="text-2xl mb-2">💡</p>
        <h2 className="text-lg font-semibold text-foreground mb-4 justified-text">You might explore</h2>
        <ul className="flex flex-col gap-2.5 mb-8">
          {tips.map((s, i) => (
            <motion.li key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...t, delay: 0.1 + i * 0.06 }}
              className="cloud-shadow rounded-2xl bg-card/80 px-5 py-3.5">
              <p className="justified-text text-foreground text-sm">{s}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...t, delay: 0.4 }}>
        <p className="text-xl mb-2">🎯</p>
        <h3 className="text-base font-semibold text-foreground mb-3 justified-text">A small step (optional)</h3>
        <div className="flex flex-col gap-2.5">
          {steps.map((o, i) => <Opt key={o} label={o} delay={0.5 + i * 0.04} selected={answers.step === o} onClick={() => setAnswer("step", o)} />)}
        </div>
      </motion.div>
      {answers.step && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.2 }} className="mt-6">
          <Btn onClick={onNext}>Continue</Btn>
        </motion.div>
      )}
    </div>
  );
};

/* ─── SCREEN 10: Closing ─── */
const S10 = () => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={t}
      className="cloud-shadow rounded-3xl bg-card/80 p-8 w-full mb-8">
      <p className="justified-text text-foreground text-base leading-relaxed">
        You don&apos;t have to figure everything out right now. Give yourself permission to explore at your own pace.
      </p>
    </motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...t, delay: 0.3 }} className="w-full flex flex-col gap-3">
      <Btn onClick={() => {}}>Save my profile</Btn>
      <Btn onClick={() => {}} variant="secondary">Revisit later</Btn>
      <Btn onClick={() => window.location.reload()} variant="ghost">Go to home</Btn>
    </motion.div>
  </div>
);

export default ExploreIdentity;
