const TODAY = new Date();
TODAY.setHours(0,0,0,0);

// ─── TGE DAY OFFSETS ─────────────────────────────────────────────────────────
const SOLSTICE_TGE_DAYS  = [7, 14, 21, 30];

// OnRe: fixed target dates → compute offsets dynamically from TODAY
const ONRE_TARGETS = [
  { date: "2026-06-30", label: "Q2 '26" },
  { date: "2026-09-30", label: "Q3 '26" },
  { date: "2026-12-31", label: "Q4 '26" },
  { date: "2027-03-31", label: "Q1 '27" },
  { date: "2027-06-30", label: "Q2 '27" },
];
const ONRE_TGE_DAYS = ONRE_TARGETS.map(t => Math.round((new Date(t.date) - TODAY) / (1000*60*60*24)));
const ONRE_TGE_LABELS = Object.fromEntries(ONRE_TGE_DAYS.map((d, i) => [d, ONRE_TARGETS[i].label]));

// Piggybank: quarter-end dates Q2 2026 → Q2 2027
const PIGGYBANK_TARGETS = [
  { date: "2026-06-30", label: "Q2 '26" },
  { date: "2026-09-30", label: "Q3 '26" },
  { date: "2026-12-31", label: "Q4 '26" },
  { date: "2027-03-31", label: "Q1 '27" },
  { date: "2027-06-30", label: "Q2 '27" },
];
const PIGGYBANK_TGE_DAYS = PIGGYBANK_TARGETS.map(t => Math.round((new Date(t.date) - TODAY) / (1000*60*60*24)));
const PIGGYBANK_TGE_LABELS = Object.fromEntries(PIGGYBANK_TGE_DAYS.map((d, i) => [d, PIGGYBANK_TARGETS[i].label]));
// No campaign freeze — Season 1 continues after Season 0 (Mar 31)

// ─── ALLOCATION SCENARIOS ────────────────────────────────────────────────────
const SOLSTICE_ALLOC_SCENARIOS = [
  { pct: 0.080, label: "8%",   tokens: "80M",  icon: "🟠", color: "text-orange-400", badgeBg: "bg-orange-900/50", note: "Lower bound — 7.5% base + minimal milestone bonus." },
  { pct: 0.085, label: "8.5%", tokens: "85M",  icon: "🟡", color: "text-yellow-400", badgeBg: "bg-yellow-900/50", note: "Confirmed ICO allocation from the Legion launchpad sale." },
];

const ONRE_ALLOC_SCENARIOS = [
  { pct: 0.05, label: "5%",  tokens: "50M",  icon: "🔴", color: "text-red-400",    badgeBg: "bg-red-900/50",    note: "Very low — most allocation to team/investors. Unlikely for community-focused protocol." },
  { pct: 0.08, label: "8%",  tokens: "80M",  icon: "🟠", color: "text-orange-400", badgeBg: "bg-orange-900/50", note: "Conservative. Typical for protocols with significant VC backing." },
  { pct: 0.10, label: "10%", tokens: "100M", icon: "🟡", color: "text-yellow-400", badgeBg: "bg-yellow-900/50", note: "Base assumption. Common industry standard for community airdrop pools." },
  { pct: 0.12, label: "12%", tokens: "120M", icon: "🟢", color: "text-green-400",  badgeBg: "bg-green-900/50",  note: "Generous. Suggests strong emphasis on community distribution." },
  { pct: 0.15, label: "15%", tokens: "150M", icon: "🚀", color: "text-purple-400", badgeBg: "bg-purple-900/50", note: "Very generous. Uncommon but possible for broad distribution at launch." },
];

const PIGGYBANK_ALLOC_SCENARIOS = [
  { pct: 0.05, label: "5%",  tokens: "50M",  icon: "🔴", color: "text-red-400",    badgeBg: "bg-red-900/50",    note: "Very low — minimal community share. Unlikely given the Oinks campaign prominence." },
  { pct: 0.08, label: "8%",  tokens: "80M",  icon: "🟠", color: "text-orange-400", badgeBg: "bg-orange-900/50", note: "Conservative. Possible if team/investors retain most supply." },
  { pct: 0.10, label: "10%", tokens: "100M", icon: "🟡", color: "text-yellow-400", badgeBg: "bg-yellow-900/50", note: "Base case. Standard community allocation for Solana xStocks protocols." },
  { pct: 0.12, label: "12%", tokens: "120M", icon: "🟢", color: "text-green-400",  badgeBg: "bg-green-900/50",  note: "Generous. Rewards heavy Oinks farmers. Achievable given early-stage community focus." },
  { pct: 0.15, label: "15%", tokens: "150M", icon: "🚀", color: "text-purple-400", badgeBg: "bg-purple-900/50", note: "Very generous. Maximum upside scenario — strong community-first tokenomics." },
];

const ALLOC_SCENARIOS    = { solstice: SOLSTICE_ALLOC_SCENARIOS, onre: ONRE_ALLOC_SCENARIOS, piggybank: PIGGYBANK_ALLOC_SCENARIOS };
const DEFAULT_ALLOC_IDX  = { solstice: 0, onre: 2, piggybank: 2 };

// ─── PROTOCOL CONFIGS ────────────────────────────────────────────────────────
const PROTOCOLS = {
  solstice: {
    id: "solstice", name: "Solstice Finance", icon: "🔥",
    tokenSymbol: "SLX", pointsLabel: "Flares",
    totalSupply: 1_000_000_000, currentTvl: 370_000_000,
    myPoints: 438_600_000,    totalPoints: 379_100_000_000,
    myDaily: 10_000_000,      totalDaily: 1_800_000_000,
    campaignEndDays: null,    // no hard freeze
    tgeDays: SOLSTICE_TGE_DAYS, defaultFdvIdx: 3,
    wallets: [],
    tokenomicsNote: "1B SLX supply · Confirmed airdrop: 7.5–8.5% · TVL $370M · TGE within ~1 month",
    tokenomicsConfirmed: true,
    gradientFrom: "from-orange-500", gradientTo: "to-yellow-400",
    bgGradient: "from-gray-950 via-orange-950 to-gray-950",
    accentText: "text-orange-400", accentBg: "bg-orange-500", allocAccent: "bg-amber-700",
    logoBg: "bg-white",
    fdvScenarios: [
      { fdv:  50_000_000, label: "$50M",  icon: "🐻", assessment: "Bear",    color: "text-red-400",    borderColor: "border-red-500/40",    bgColor: "bg-red-950/40",    badgeBg: "bg-red-900/50",    rationale: "Deep bear. FDV/TVL 0.14x. Only in a broad market collapse." },
      { fdv: 100_000_000, label: "$100M", icon: "📉", assessment: "Bearish", color: "text-orange-400", borderColor: "border-orange-500/40", bgColor: "bg-orange-950/40", badgeBg: "bg-orange-900/50", rationale: "Conservative. FDV/TVL 0.27x, below $130M ICO price. Possible in a risk-off environment." },
      { fdv: 130_000_000, label: "$130M", icon: "💰", assessment: "ICO Ref", color: "text-yellow-400", borderColor: "border-yellow-500/40", bgColor: "bg-yellow-950/40", badgeBg: "bg-yellow-900/50", rationale: "Legion launchpad ICO reference. FDV/TVL 0.35x. Floor for presale participants." },
      { fdv: 200_000_000, label: "$200M", icon: "✅", assessment: "Base ✓",  color: "text-green-400",  borderColor: "border-green-500/40",  bgColor: "bg-green-950/40",  badgeBg: "bg-green-900/50",  rationale: "Most likely. FDV/TVL 0.54x — fair for a yield stablecoin with $370M TVL and Solana-native moat." },
      { fdv: 300_000_000, label: "$300M", icon: "🚀", assessment: "Bull",    color: "text-purple-400", borderColor: "border-purple-500/40", bgColor: "bg-purple-950/40", badgeBg: "bg-purple-900/50", rationale: "Bull. FDV/TVL 0.81x. Achievable if TVL grows past $400M+ and Solana DeFi sentiment is strong." },
    ],
  },
  onre: {
    id: "onre", name: "OnRe Finance", icon: "🛡️",
    tokenSymbol: "ONRE", pointsLabel: "Points",
    totalSupply: 1_000_000_000, currentTvl: 128_000_000,
    myPoints: 42_087_793,   totalPoints: 51_513_058_629,
    myDaily: 649_593,       totalDaily: 590_232_161,
    campaignEndDays: null,
    tgeDays: ONRE_TGE_DAYS, defaultFdvIdx: 2,
    wallets: [
      { label: "F1YmRn... (rank #205)",  points19: 38_334_575, points18: 37_755_062 },
      { label: "BEVQDB... (rank #1380)", points19:  3_753_218, points18:  3_683_138 },
    ],
    tokenomicsNote: "⚠️ Unconfirmed — assumed 1B ONRE supply · TVL ~$128M · TGE estimated Sep–Dec 2026",
    tokenomicsConfirmed: false,
    gradientFrom: "from-blue-500", gradientTo: "to-cyan-400",
    bgGradient: "from-gray-950 via-blue-950 to-gray-950",
    accentText: "text-blue-400", accentBg: "bg-blue-600", allocAccent: "bg-cyan-700",
    logoBg: "bg-gray-800",
    fdvScenarios: [
      { fdv:  50_000_000, label: "$50M",  icon: "🐻", assessment: "Bear",    color: "text-red-400",    borderColor: "border-red-500/40",    bgColor: "bg-red-950/40",    badgeBg: "bg-red-900/50",    rationale: "Deep bear. FDV/TVL 0.39x. Possible if launch is low-hype or broadly bearish." },
      { fdv: 100_000_000, label: "$100M", icon: "📉", assessment: "Bearish", color: "text-orange-400", borderColor: "border-orange-500/40", bgColor: "bg-orange-950/40", badgeBg: "bg-orange-900/50", rationale: "Conservative. FDV/TVL 0.78x. Discount for unconfirmed tokenomics and nascent RWA sector." },
      { fdv: 150_000_000, label: "$150M", icon: "✅", assessment: "Base ✓",  color: "text-green-400",  borderColor: "border-green-500/40",  bgColor: "bg-green-950/40",  badgeBg: "bg-green-900/50",  rationale: "Most likely. FDV/TVL ~1.17x. Ethena, Solana Ventures & RockawayX backing. Real yield premium." },
      { fdv: 200_000_000, label: "$200M", icon: "📈", assessment: "Bullish", color: "text-yellow-400", borderColor: "border-yellow-500/40", bgColor: "bg-yellow-950/40", badgeBg: "bg-yellow-900/50", rationale: "Bullish. FDV/TVL 1.56x. Justified if TVL grows toward $200M+ at launch." },
      { fdv: 300_000_000, label: "$300M", icon: "🚀", assessment: "Bull",    color: "text-purple-400", borderColor: "border-purple-500/40", bgColor: "bg-purple-950/40", badgeBg: "bg-purple-900/50", rationale: "Bull. FDV/TVL 2.34x. Needs significant TVL growth, strong RWA narrative." },
    ],
  },
  piggybank: {
    id: "piggybank", name: "Piggybank", icon: "🐷",
    tokenSymbol: "OINK", pointsLabel: "Oinks",
    totalSupply: 1_000_000_000, currentTvl: 20_000_000,
    // Your Oinks: 444,765 | Total: 120M
    // 7M Oinks per epoch (2 days) → 3.5M/day total | 30K per epoch → 15K/day yours
    // Season 0 ends Mar 31, Season 1 continues → no freeze, TGE Q1 2027
    myPoints: 444_765,      totalPoints: 120_000_000,
    myDaily: 15_000,        totalDaily: 3_500_000,
    campaignEndDays: null,  // no freeze — Season 1 continues
    tgeDays: PIGGYBANK_TGE_DAYS, defaultFdvIdx: 2,
    wallets: [],
    tokenomicsNote: "⚠️ No token confirmed · Assumed 1B OINK supply · TVL ~$20M · Season 0 ends Mar 31 → Season 1 continues · TGE expected Q1 2027",
    tokenomicsConfirmed: false,
    gradientFrom: "from-pink-500", gradientTo: "to-rose-400",
    bgGradient: "from-gray-950 via-pink-950 to-gray-950",
    accentText: "text-pink-400", accentBg: "bg-pink-600", allocAccent: "bg-rose-700",
    logoBg: "bg-transparent",
    fdvScenarios: [
      { fdv:   5_000_000, label: "$5M",   icon: "🐻", assessment: "Bear",    color: "text-red-400",    borderColor: "border-red-500/40",    bgColor: "bg-red-950/40",    badgeBg: "bg-red-900/50",    rationale: "Deep bear. FDV/TVL 0.25x. Extremely low — only if token launch is largely ignored or market is broadly bearish." },
      { fdv:  10_000_000, label: "$10M",  icon: "📉", assessment: "Bearish", color: "text-orange-400", borderColor: "border-orange-500/40", bgColor: "bg-orange-950/40", badgeBg: "bg-orange-900/50", rationale: "Conservative. FDV/TVL 0.5x. Modest valuation for an early-stage xStocks yield protocol with $20M TVL." },
      { fdv:  20_000_000, label: "$20M",  icon: "✅", assessment: "Base ✓",  color: "text-green-400",  borderColor: "border-green-500/40",  bgColor: "bg-green-950/40",  badgeBg: "bg-green-900/50",  rationale: "Base case. FDV/TVL 1.0x. Fair value at launch if TVL holds at $20M — standard ratio for early Solana DeFi." },
      { fdv:  50_000_000, label: "$50M",  icon: "📈", assessment: "Bullish", color: "text-yellow-400", borderColor: "border-yellow-500/40", bgColor: "bg-yellow-950/40", badgeBg: "bg-yellow-900/50", rationale: "Bullish. FDV/TVL 2.5x. Possible if TVL grows and xStocks/RWA narrative on Solana gains traction." },
      { fdv: 100_000_000, label: "$100M", icon: "🚀", assessment: "Bull",    color: "text-purple-400", borderColor: "border-purple-500/40", bgColor: "bg-purple-950/40", badgeBg: "bg-purple-900/50", rationale: "Bull case. FDV/TVL 5.0x. Aggressive but achievable if Piggybank becomes the dominant xStocks yield layer on Solana." },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Storage abstraction — works in Claude artifacts (window.storage) and Vercel (localStorage)
const storage = {
  async get(key) {
    try {
      if (window.storage?.get) {
        const r = await window.storage.get(key);
        return r?.value ?? null;
      }
    } catch(e) {}
    try { return localStorage.getItem(key); } catch(e) {}
    return null;
  },
  async set(key, value) {
    try {
      if (window.storage?.set) {
        await window.storage.set(key, value);
        return;
      }
    } catch(e) {}
    try { localStorage.setItem(key, value); } catch(e) {}
  },
};

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtDateShort(d) { return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`; }
function fmtDate(days, proto) {
  const labels = proto === "piggybank" ? PIGGYBANK_TGE_LABELS : ONRE_TGE_LABELS;
  return labels[days] || fmtDateShort(addDays(TODAY, days));
}
function fmtUsd(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
function fmtNum(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [protoState, setProtoState] = useState({
    activeProtocol: "solstice",
    selectedDay: PROTOCOLS["solstice"].tgeDays[1],
    selectedFdvIdx: PROTOCOLS["solstice"].defaultFdvIdx,
    allocIdxByProto: DEFAULT_ALLOC_IDX,
  });
  const { activeProtocol, selectedDay, selectedFdvIdx, allocIdxByProto } = protoState;
  const selectedAllocIdx = allocIdxByProto[activeProtocol];
  const setSelectedAllocIdx = (idx) => setProtoState(prev => ({ ...prev, allocIdxByProto: { ...prev.allocIdxByProto, [prev.activeProtocol]: idx } }));
  const setSelectedDay = (day) => setProtoState(prev => ({ ...prev, selectedDay: day }));
  const setSelectedFdvIdx = (idx) => setProtoState(prev => ({ ...prev, selectedFdvIdx: idx }));
  const [showWallets,      setShowWallets]       = useState(false);
  const [showEditPoints,   setShowEditPoints]    = useState(false);
  const [showValuePer1M,   setShowValuePer1M]   = useState(true);
  const [customDate,       setCustomDate]        = useState("");
  const [showCalendar,     setShowCalendar]      = useState(false);
  const [calMonth,         setCalMonth]          = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const dateInputRef = useRef(null);

  // Manual point overrides — keyed by protocol id
  const [manualPoints, setManualPoints] = useState({
    solstice: { myPoints: "", totalPoints: "", myDaily: "", totalDaily: "" },
    onre:     { myPoints: "", totalPoints: "", myDaily: "", totalDaily: "" },
    piggybank:{ myPoints: "", totalPoints: "", myDaily: "", totalDaily: "" },
  });

  // appliedPoints holds the committed values after clicking Apply
  const [appliedPoints, setAppliedPoints] = useState({
    solstice: { myPoints: null, totalPoints: null, myDaily: null, totalDaily: null },
    onre:     { myPoints: null, totalPoints: null, myDaily: null, totalDaily: null },
    piggybank:{ myPoints: null, totalPoints: null, myDaily: null, totalDaily: null },
  });

  // savedDefaults — persisted via window.storage so values survive across sessions
  const [savedDefaults, setSavedDefaults] = useState({
    solstice: { myPoints: null, totalPoints: null, myDaily: null, totalDaily: null, savedAt: null },
    onre:     { myPoints: null, totalPoints: null, myDaily: null, totalDaily: null, savedAt: null },
    piggybank:{ myPoints: null, totalPoints: null, myDaily: null, totalDaily: null, savedAt: null },
  });
  // Load saved defaults from window.storage on mount (persists across sessions in Claude artifacts)
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await storage.get("airdrop-estimator-defaults");
        if (raw) {
          const parsed = JSON.parse(raw);
          const todayMs = new Date().setHours(0,0,0,0);
          // For each protocol, auto-accrue points based on days elapsed since savedAt
          const accrue = (proto, data) => {
            const base = { myPoints: null, totalPoints: null, myDaily: null, totalDaily: null, savedAt: null, ...data };
            if (base.savedAt && base.myDaily && base.totalDaily && base.myPoints !== null && base.totalPoints !== null) {
              const savedMs = new Date(base.savedAt).setHours(0,0,0,0);
              const daysElapsed = Math.max(0, Math.round((todayMs - savedMs) / (1000*60*60*24)));
              if (daysElapsed > 0) {
                return {
                  ...base,
                  myPoints:    Math.round(base.myPoints    + base.myDaily    * daysElapsed),
                  totalPoints: Math.round(base.totalPoints + base.totalDaily * daysElapsed),
                  savedAt: new Date(todayMs).toISOString(), // update savedAt to today
                };
              }
            }
            return base;
          };
          const merged = {
            solstice: accrue("solstice", parsed.solstice || {}),
            onre:     accrue("onre",     parsed.onre     || {}),
            piggybank:accrue("piggybank",parsed.piggybank|| {}),
          };
          setSavedDefaults(merged);
          setAppliedPoints(merged);
          // Persist the accrued values back so next load starts fresh from today
          try { await storage.set("airdrop-estimator-defaults", JSON.stringify(merged)); } catch(e) {}
        }
      } catch (e) {
        // Key not found or parse error — use hardcoded defaults
      }
    };
    load();
  }, []);

  const parseInput = (val) => {
    if (!val || val.trim() === "") return null;
    // Support shorthand: 438.6M, 379.1B, 120mil, 42k etc.
    const s = val.trim().replace(/,/g, "");
    const num = parseFloat(s);
    if (isNaN(num)) return null;
    const suffix = s.slice(-1).toLowerCase();
    if (suffix === "b") return Math.round(num * 1e9);
    if (suffix === "m") return Math.round(num * 1e6);
    if (suffix === "k") return Math.round(num * 1e3);
    return Math.round(num);
  };

  const proto      = PROTOCOLS[activeProtocol];
  const isSolstice = activeProtocol === "solstice";
  const isOnre     = activeProtocol === "onre";
  const isPiggy    = activeProtocol === "piggybank";
  const isLong     = isOnre || isPiggy;
  const allocList  = ALLOC_SCENARIOS[activeProtocol];
  const selAlloc   = allocList[selectedAllocIdx];
  const activePct  = selAlloc.pct;
  const airdropPool = proto.totalSupply * activePct;

  const getOverride = (field) =>
    appliedPoints[activeProtocol]?.[field] ??
    savedDefaults[activeProtocol]?.[field] ??
    null;

  const effectiveMyPoints    = getOverride("myPoints")    ?? proto.myPoints;
  const effectiveTotalPoints = getOverride("totalPoints") ?? proto.totalPoints;
  const effectiveMyDaily     = getOverride("myDaily")     ?? proto.myDaily;
  const effectiveTotalDaily  = getOverride("totalDaily")  ?? proto.totalDaily;

  const updateManual = (field, val) => {
    setManualPoints(prev => ({
      ...prev,
      [activeProtocol]: { ...prev[activeProtocol], [field]: val }
    }));
  };

  const handleApply = () => {
    setAppliedPoints(prev => ({
      ...prev,
      [activeProtocol]: {
        myPoints:    parseInput(manualPoints[activeProtocol].myPoints),
        totalPoints: parseInput(manualPoints[activeProtocol].totalPoints),
        myDaily:     parseInput(manualPoints[activeProtocol].myDaily),
        totalDaily:  parseInput(manualPoints[activeProtocol].totalDaily),
      }
    }));
  };

  const handleSaveAsDefault = async () => {
    const parsed = {
      myPoints:    parseInput(manualPoints[activeProtocol].myPoints),
      totalPoints: parseInput(manualPoints[activeProtocol].totalPoints),
      myDaily:     parseInput(manualPoints[activeProtocol].myDaily),
      totalDaily:  parseInput(manualPoints[activeProtocol].totalDaily),
    };
    const existing = savedDefaults[activeProtocol] || {};
    const newDefaults = {
      myPoints:    parsed.myPoints    !== null ? parsed.myPoints    : existing.myPoints    ?? null,
      totalPoints: parsed.totalPoints !== null ? parsed.totalPoints : existing.totalPoints ?? null,
      myDaily:     parsed.myDaily     !== null ? parsed.myDaily     : existing.myDaily     ?? null,
      totalDaily:  parsed.totalDaily  !== null ? parsed.totalDaily  : existing.totalDaily  ?? null,
      savedAt:     new Date(new Date().setHours(0,0,0,0)).toISOString(), // stamp today's date
    };
    const updatedSaved = { ...savedDefaults, [activeProtocol]: newDefaults };
    setSavedDefaults(updatedSaved);
    setAppliedPoints(prev => ({ ...prev, [activeProtocol]: newDefaults }));
    setManualPoints(prev => ({ ...prev, [activeProtocol]: { myPoints: "", totalPoints: "", myDaily: "", totalDaily: "" } }));
    try { await storage.set("airdrop-estimator-defaults", JSON.stringify(updatedSaved)); } catch(e) {
      console.error("Failed to save defaults:", e);
    }
  };

  const handleProtocolSwitch = (id) => {
    setProtoState(prev => ({
      ...prev,
      activeProtocol: id,
      selectedFdvIdx: PROTOCOLS[id].defaultFdvIdx,
      selectedDay: PROTOCOLS[id].tgeDays[1],
    }));
    setShowWallets(false);
    setCustomDate("");
  };

  // Points at TGE — Piggybank has no freeze (Season 1 continues after Season 0)
  const getPointsAtTge = (days, isMyPoints) => {
    const base  = isMyPoints ? effectiveMyPoints    : effectiveTotalPoints;
    const daily = isMyPoints ? effectiveMyDaily : effectiveTotalDaily;
    if (proto.campaignEndDays !== null) {
      // Points only accrue up to campaign end
      const accrualDays = Math.min(days, proto.campaignEndDays);
      return base + daily * accrualDays;
    }
    return base + daily * days;
  };

  const tgeScenarios = useMemo(() =>
    proto.tgeDays.map((days) => {
      const myP    = getPointsAtTge(days, true);
      const totalP = getPointsAtTge(days, false);
      const share  = myP / totalP;
      const tokens = share * airdropPool;
      return { days, myP, totalP, share, tokens };
    }), [activeProtocol, selectedAllocIdx, appliedPoints]);

  // Custom date logic — must come before selTge and allocFdvGrid
  const isCustomActive  = customDate !== "" && customDate !== "pick";
  const customDays = isCustomActive
    ? Math.round((new Date(customDate) - TODAY) / (1000 * 60 * 60 * 24))
    : null;
  const effectiveDay = customDays !== null ? customDays : selectedDay;

  const effectiveTge = (() => {
    if (!isCustomActive) return tgeScenarios.find(s => s.days === selectedDay) || tgeScenarios[1];
    const myP    = effectiveMyPoints    + effectiveMyDaily    * Math.max(0, effectiveDay);
    const totalP = effectiveTotalPoints + effectiveTotalDaily * Math.max(0, effectiveDay);
    const share  = myP / totalP;
    const tokens = share * airdropPool;
    return { days: effectiveDay, myP, totalP, share, tokens, custom: true };
  })();

  const dilutionMonths  = isLong ? Math.round(effectiveDay / 30) : null;

  const selTge     = effectiveTge;
  const selFdv     = proto.fdvScenarios[selectedFdvIdx];
  const tokenPrice = selFdv.fdv / proto.totalSupply;
  const myUsd      = selTge ? selTge.tokens * tokenPrice : 0;

  const fdvGrid = useMemo(() =>
    tgeScenarios.map(tge =>
      proto.fdvScenarios.map(f => tge.tokens * (f.fdv / proto.totalSupply))
    ), [activeProtocol, selectedAllocIdx, tgeScenarios, appliedPoints, savedDefaults]);

  const allocFdvGrid = useMemo(() => {
    const myP    = effectiveMyPoints    + effectiveMyDaily    * Math.max(0, effectiveDay);
    const totalP = effectiveTotalPoints + effectiveTotalDaily * Math.max(0, effectiveDay);
    return allocList.map(alloc => {
      const myTokens = (myP / totalP) * (proto.totalSupply * alloc.pct);
      return proto.fdvScenarios.map(f => myTokens * (f.fdv / proto.totalSupply));
    });
  }, [activeProtocol, selectedDay, customDate, selectedAllocIdx, tgeScenarios, appliedPoints, savedDefaults]);




  // Piggybank: Season 1 continues after Season 0 — no freeze
  const S0_END = Math.max(0, Math.round((new Date("2026-03-31") - TODAY) / (1000*60*60*24)));
  const piggyS0EndMyPts   = isPiggy ? effectiveMyPoints    + effectiveMyDaily    * S0_END : null;
  const piggyS0EndTotalPts = isPiggy ? effectiveTotalPoints + effectiveTotalDaily * S0_END : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${proto.bgGradient} text-white font-sans transition-all duration-500`}>
      <div className="mx-auto p-3 space-y-3" style={{width:"min(95%, 1400px)", minWidth:"320px"}}>

        {/* ── COMPACT HEADER BAR ── */}
        <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          {/* Logo / Title — left */}
          <div className="shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center overflow-hidden ${proto.logoBg}`}>
                <img src={LOGOS[activeProtocol]} alt={proto.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className={`text-base font-bold bg-gradient-to-r ${proto.gradientFrom} ${proto.gradientTo} bg-clip-text text-transparent leading-tight`}>
                  Airdrop Estimator
                </div>
                <div className="text-xs text-gray-500 leading-tight">{proto.name} · {proto.tokenSymbol}</div>
              </div>
            </div>
          </div>

          {/* Protocol Switcher — absolutely centered */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
            {Object.values(PROTOCOLS).map(p => (
              <button key={p.id} onClick={() => handleProtocolSwitch(p.id)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeProtocol === p.id
                    ? `bg-gradient-to-r ${p.gradientFrom} ${p.gradientTo} text-white shadow-lg`
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`} style={{width:"clamp(100px, 160px, 30vw)"}}>
                <div className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center overflow-hidden ${p.logoBg}`}>
                  <img src={LOGOS[p.id]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>



        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap:"1rem", alignItems:"start"}}>

          {/* ── LEFT COLUMN ── */}
          <div className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 flex flex-col gap-3`}>

        {/* Stats row — uniform 2×2 grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: `Your ${proto.pointsLabel}`, value: fmtNum(effectiveMyPoints),    logo: true,  overridden: getOverride("myPoints") !== null },
            { label: `Total ${proto.pointsLabel}`, value: fmtNum(effectiveTotalPoints), dot: "bg-blue-400",  overridden: getOverride("totalPoints") !== null },
            { label: isPiggy ? "Your Daily (epoch)" : "Your Daily",  value: `+${fmtNum(effectiveMyDaily)}`,    dot: "bg-green-400", overridden: getOverride("myDaily")    !== null },
            { label: isPiggy ? "Total Daily (epoch)" : "Total Daily", value: `+${fmtNum(effectiveTotalDaily)}`, dot: "bg-purple-400", overridden: getOverride("totalDaily") !== null },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl px-4 py-3 flex items-center gap-3 transition-colors h-16 ${s.overridden ? "bg-emerald-900/20 border-emerald-500/40" : "bg-black/20 border-white/8"}`}>
              {s.logo
                ? <div className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center overflow-hidden ${proto.logoBg}`}>
                    <img src={LOGOS[activeProtocol]} alt={proto.name} className="w-full h-full object-cover" />
                  </div>
                : <div className={`w-2 h-2 rounded-full shrink-0 ${s.overridden ? "bg-emerald-400" : s.dot}`}></div>
              }
              <div className="min-w-0">
                <div className={`font-bold text-base leading-tight truncate ${s.overridden ? "text-emerald-300" : "text-white"}`}>{s.value}</div>
                <div className="text-xs text-gray-500 leading-tight truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MANUAL POINTS UPDATE PANEL ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <button onClick={() => setShowEditPoints(!showEditPoints)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm text-gray-300 hover:bg-white/5 transition-colors">
            <span className="flex items-center gap-2">
              <span className="text-xs">✏️</span>
              <span className="font-medium text-xs">Update {proto.pointsLabel} & Daily Rates</span>
            </span>
            <span className="text-gray-500 text-xs">{showEditPoints ? "▲ hide" : "▼ edit"}</span>
          </button>
          {showEditPoints && (
            <div className="border-t border-white/10 p-3 space-y-3">

              {/* Saved defaults summary — compact single line */}
              {(savedDefaults[activeProtocol]?.myPoints !== null || savedDefaults[activeProtocol]?.totalPoints !== null) && (
                <div className="bg-emerald-900/15 border border-emerald-500/20 rounded-lg px-3 py-2">
                  {savedDefaults[activeProtocol]?.savedAt && (
                    <p className="text-xs text-emerald-500">
                      🔄 Auto-accruing since <span className="text-emerald-300 font-medium">{fmtDateShort(new Date(savedDefaults[activeProtocol].savedAt))}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Input fields */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { field: "myPoints",    label: `Your ${proto.pointsLabel}`,  accent: true },
                  { field: "totalPoints", label: `Total ${proto.pointsLabel}`, accent: false },
                  { field: "myDaily",     label: "Your Daily Rate",            accent: true },
                  { field: "totalDaily",  label: "Total Daily Rate",           accent: false },
                ].map(({ field, label, accent }) => (
                  <div key={field}>
                    <label className={`text-xs font-medium mb-1 block ${accent ? proto.accentText : "text-gray-400"}`}>{label}</label>
                    <div className="relative">
                      <input type="text"
                        value={manualPoints[activeProtocol][field]}
                        onChange={e => updateManual(field, e.target.value)}
                        placeholder={savedDefaults[activeProtocol]?.[field] ? fmtNum(savedDefaults[activeProtocol][field]) : fmtNum(proto[field === "myPoints" ? "myPoints" : field === "totalPoints" ? "totalPoints" : field === "myDaily" ? "myDaily" : "totalDaily"])}
                        className={`w-full bg-black/30 border rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 outline-none focus:ring-1 transition-colors ${getOverride(field) !== null ? "border-emerald-500/50 focus:ring-emerald-500/30" : "border-white/10 focus:ring-white/20"}`}
                      />
                      {getOverride(field) !== null && (
                        <button onClick={() => updateManual(field, "")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white text-xs">✕</button>
                      )}
                    </div>
                    {getOverride(field) !== null && (
                      <p className="text-xs text-emerald-400 mt-0.5">→ {fmtNum(getOverride(field))}{field.includes("Daily") ? "/day" : ""}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Hint + Buttons */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="text-xs text-gray-600">Supports: <span className="text-gray-400">438.6M · 379.1B · 120M</span></p>
                <div className="flex gap-2">
                  <button onClick={handleApply} className={`text-xs px-4 py-1.5 rounded-lg font-semibold transition-all ${proto.accentBg} text-white hover:opacity-90 shadow-sm`}>
                    Apply
                  </button>
                  <button onClick={handleSaveAsDefault} className="text-xs px-4 py-1.5 rounded-lg font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-all border border-emerald-600/40">
                    💾 Save
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ── SELECTORS ── */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">TGE Date</p>
            <div className="flex gap-0.5 items-center overflow-x-auto" style={{scrollbarWidth:"none"}}>
              {tgeScenarios.map(s => (
                <button key={s.days} onClick={() => { setSelectedDay(s.days); setCustomDate(""); }}
                  className={`shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                    !isCustomActive && selectedDay === s.days
                      ? `${proto.accentBg} border-transparent text-white`
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}>
                  {isSolstice
                    ? fmtDateShort(addDays(TODAY, s.days))
                    : fmtDate(s.days, activeProtocol)
                  }
                </button>
              ))}
              {isCustomActive ? (
                <div className={`shrink-0 inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium ${proto.accentBg} border-transparent text-white`}>
                  <span>📅</span>
                  <span>{(() => { const d = new Date(customDate); return `${fmtDateShort(d)} ${d.getFullYear()}`; })()}</span>
                  <button onClick={() => setCustomDate("")} className="text-white/60 hover:text-white ml-0.5">✕</button>
                </div>
              ) : (
                <label className="shrink-0 relative inline-flex items-center px-2 py-1.5 rounded-lg border text-xs font-medium bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 cursor-pointer whitespace-nowrap overflow-hidden">
                  📅 Custom
                  <input
                    type="date"
                    value={customDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setCustomDate(e.target.value)}
                    style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", padding:0, border:"none" }}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">FDV Scenario</p>
            <div className="flex gap-1">
              {proto.fdvScenarios.map((f, i) => (
                <button key={f.fdv} onClick={() => setSelectedFdvIdx(i)}
                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                    selectedFdvIdx === i
                      ? `${f.badgeBg} border-transparent ${f.color}`
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`} style={{minWidth:0}}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-2">Airdrop Allocation</p>
            <div className="flex flex-wrap gap-1">
              {allocList.map((a, i) => (
                <button key={a.label} onClick={() => setSelectedAllocIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedAllocIdx === i
                      ? `${proto.allocAccent} border-transparent text-white`
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN RESULT CARD ── */}
        {selTge && (
          <div className={`border ${selFdv.borderColor} ${selFdv.bgColor} rounded-2xl overflow-hidden flex flex-col flex-1`}>
            {/* Hero value */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-1 h-4 rounded-full ${proto.accentBg} inline-block shrink-0`}></span>
                <span className={`text-xs font-extrabold uppercase tracking-[0.2em] ${proto.accentText}`}>Estimated Airdrop Value</span>
              </div>
              <div className={`text-6xl font-black mb-2 bg-gradient-to-r ${proto.gradientFrom} ${proto.gradientTo} bg-clip-text text-transparent leading-none`}>
                {fmtUsd(myUsd)}
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-sm text-gray-400 font-medium">{fmtNum(selTge.tokens)} {proto.tokenSymbol}</span>
                <span className="text-gray-600">·</span>
                <span className={`text-sm font-bold ${selFdv.color}`}>${tokenPrice.toFixed(4)}/{proto.tokenSymbol}</span>
              </div>
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${selFdv.badgeBg} ${selFdv.color} border ${selFdv.borderColor}`}>
                  {selFdv.icon} {selFdv.assessment}
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${selAlloc.badgeBg} ${selAlloc.color} border border-white/10`}>
                  {selAlloc.icon} {selAlloc.label} alloc
                </div>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-200 border border-white/20`}>
                  FDV/TVL: {(selFdv.fdv / proto.currentTvl).toFixed(2)}x
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/10">
              {[
                { label: "Pool Share",              value: (selTge.share * 100).toFixed(isPiggy ? 3 : 5) + "%", color: proto.accentText },
                { label: "Airdrop Pool",            value: fmtNum(airdropPool),    color: "text-cyan-300" },
                { label: `Your ${proto.pointsLabel} @ TGE`, value: fmtNum(selTge.myP),   color: "text-yellow-300" },
                { label: "Total @ TGE",             value: fmtNum(selTge.totalP),  color: "text-gray-300" },
              ].map(s => (
                <div key={s.label} className="bg-black/20 px-4 py-3">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="p-4 space-y-3 border-t border-white/10">
              <div>
                <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">FDV Assessment</div>
                <p className="text-xs text-gray-300 leading-relaxed">{selFdv.rationale}</p>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Allocation Note</div>
                <p className="text-xs text-gray-300 leading-relaxed">{selAlloc.note}</p>
              </div>
            </div>
          </div>
        )}

          </div>{/* end LEFT COLUMN */}

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-3">

        {/* ── FDV × TGE MATRIX ── */}
        <div className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${proto.accentBg}`}></span>
              FDV × TGE Matrix
              <span className={`text-xs font-normal ml-1 ${selAlloc.color}`}>(alloc: {selAlloc.label} = {fmtNum(airdropPool)} {proto.tokenSymbol})</span>
            </span>
            <span className="text-xs text-gray-500">Click row to select</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{tableLayout:"fixed"}}>
              <colgroup>
                <col style={{width:"80px"}} />
                {proto.fdvScenarios.map(f => <col key={f.fdv} style={{width:"80px"}} />)}
              </colgroup>
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 text-left text-gray-500">TGE</th>
                  {proto.fdvScenarios.map(f => (
                    <th key={f.fdv} className={`px-3 py-2 text-right ${f.color}`}>{f.icon} {f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tgeScenarios.map((tge, ti) => (
                  <tr key={tge.days} onClick={() => setSelectedDay(tge.days)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedDay===tge.days ? "bg-white/10" : "hover:bg-white/5"}`}>
                    <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">
                      {isSolstice
                        ? <>{fmtDateShort(addDays(TODAY,tge.days))}</>
                        : <>{fmtDate(tge.days, activeProtocol)}</>
                      }
                    </td>
                    {fdvGrid[ti].map((usd, fi) => (
                      <td key={fi} className={`px-3 py-2.5 text-right font-medium ${
                        selectedDay===tge.days && selectedFdvIdx===fi ? "bg-indigo-500/20 text-white" : proto.fdvScenarios[fi].color
                      }`}>{fmtUsd(usd)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── ALLOCATION × FDV MATRIX ── */}
        <div className={`bg-white/4 border border-white/10 rounded-xl overflow-hidden`}>
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Allocation % × FDV Matrix
              <span className={`text-xs font-normal ml-1 ${proto.accentText}`}>
                @ {isCustomActive ? (() => { const d = new Date(customDate); return `${fmtDateShort(d)} ${d.getFullYear()}`; })() : isSolstice ? fmtDateShort(addDays(TODAY, selectedDay)) : fmtDate(selectedDay, activeProtocol)}
              </span>
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {tgeScenarios.map(s => (
                <button key={s.days} onClick={() => { setSelectedDay(s.days); setCustomDate(""); }}
                  className={`py-1 rounded text-xs border transition-all whitespace-nowrap ${
                    !isCustomActive && selectedDay===s.days
                      ? `${proto.accentBg} border-transparent text-white`
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`} style={{width:"52px", textAlign:"center"}}>
                  {isSolstice ? `+${s.days}d` : fmtDate(s.days, activeProtocol)}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{tableLayout:"fixed"}}>
              <colgroup>
                <col style={{width:"90px"}} />
                {proto.fdvScenarios.map(f => <col key={f.fdv} style={{width:"80px"}} />)}
              </colgroup>
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 text-left text-gray-500">Alloc %</th>
                  {proto.fdvScenarios.map(f => (
                    <th key={f.fdv} className={`px-3 py-2 text-right ${f.color}`}>{f.icon} {f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocList.map((alloc, ai) => (
                  <tr key={alloc.label} onClick={() => setSelectedAllocIdx(ai)}
                    className={`border-b border-white/5 cursor-pointer transition-colors ${selectedAllocIdx===ai ? "bg-white/10" : "hover:bg-white/5"}`}>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`font-bold ${alloc.color}`}>{alloc.icon} {alloc.label}</span>
                      <span className="text-gray-600 ml-1">({alloc.tokens})</span>
                    </td>
                    {allocFdvGrid[ai]?.map((usd, fi) => (
                      <td key={fi} className={`px-3 py-2.5 text-right font-medium ${
                        selectedAllocIdx===ai && selectedFdvIdx===fi ? "bg-indigo-500/20 text-white" : proto.fdvScenarios[fi].color
                      }`}>{fmtUsd(usd)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── VALUE PER 1M POINTS TABLE ── */}
        <div className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">
          <button onClick={() => setShowValuePer1M(v => !v)}
            className="w-full px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors border-b border-white/10">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Value per 1M {proto.pointsLabel}
              <span className="text-xs font-normal text-gray-500">— multiply by your {proto.pointsLabel.toLowerCase()} in millions</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-white/5 ${proto.accentText}`}>
                @ {isCustomActive
                  ? (() => { const d = new Date(customDate); return `${fmtDateShort(d)} ${d.getFullYear()}`; })()
                  : isSolstice ? fmtDateShort(addDays(TODAY, selectedDay)) : fmtDate(selectedDay, activeProtocol)}
              </span>
              <span className="text-gray-500 text-xs">{showValuePer1M ? "▲" : "▼"}</span>
            </div>
          </button>
          {showValuePer1M && (<>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{tableLayout:"fixed"}}>
              <colgroup>
                <col style={{width:"90px"}} />
                {proto.fdvScenarios.map(f => <col key={f.fdv} style={{width:"80px"}} />)}
              </colgroup>
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-3 py-2 text-left text-gray-500">Alloc %</th>
                  {proto.fdvScenarios.map(f => (
                    <th key={f.fdv} className={`px-3 py-2 text-right ${f.color}`}>{f.icon} {f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allocList.map((alloc, ai) => {
                  const myP1m    = effectiveMyPoints    + effectiveMyDaily    * Math.max(0, effectiveDay);
                  const totalP1m = effectiveTotalPoints + effectiveTotalDaily * Math.max(0, effectiveDay);
                  const pool = proto.totalSupply * alloc.pct;
                  return (
                    <tr key={alloc.label} onClick={() => setSelectedAllocIdx(ai)}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${selectedAllocIdx===ai ? "bg-white/10" : "hover:bg-white/5"}`}>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className={`font-bold ${alloc.color}`}>{alloc.icon} {alloc.label}</span>
                      </td>
                      {proto.fdvScenarios.map((f, fi) => {
                        const val = (1_000_000 / totalP1m) * pool * (f.fdv / proto.totalSupply);
                        return (
                          <td key={fi} className={`px-3 py-2.5 text-right font-medium ${
                            selectedAllocIdx===ai && selectedFdvIdx===fi ? "bg-indigo-500/20 text-white" : f.color
                          }`}>
                            {"$" + Math.round(val).toLocaleString("en-US")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-white/5 bg-white/3">
            <p className="text-xs text-gray-500">
              💡 You have <span className="text-white font-medium">{fmtNum(effectiveMyPoints)}</span> {proto.pointsLabel.toLowerCase()} → your share is <span className={`font-medium ${proto.accentText}`}>{(effectiveMyPoints / (effectiveTotalPoints + effectiveTotalDaily * Math.max(0, effectiveDay)) * 100).toFixed(4)}%</span> of the total pool
            </p>
          </div>
          </>)}
        </div>


        {/* ── FDV ASSESSMENT ── */}
        <div className="bg-white/4 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="text-sm font-bold text-white">FDV Assessment</span>
            <span className="text-xs text-gray-500">— {proto.name} · TVL ${(proto.currentTvl / 1e6).toFixed(0)}M</span>
          </div>
          <div className="p-3 space-y-1.5">
            {proto.fdvScenarios.map((f, i) => (
              <div key={f.fdv} onClick={() => setSelectedFdvIdx(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${
                  selectedFdvIdx===i ? `${f.borderColor} ${f.bgColor}` : "border-white/5 bg-white/3 hover:bg-white/5"
                }`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${f.badgeBg}`}></span>
                <span className={`font-bold text-xs shrink-0 ${f.color}`}>{f.label} FDV</span>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${f.badgeBg} ${f.color}`}>{f.assessment}</span>
                <span className="text-xs text-gray-400 truncate flex-1" title={f.rationale}>{f.rationale}</span>
                <span className="text-xs text-gray-500 shrink-0">FDV/TVL: {(f.fdv / proto.currentTvl).toFixed(2)}x</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-white/5 text-xs text-gray-500 text-center">
            ⚠️ Assumes linear accrual until TGE. Not financial advice.
          </div>
        </div>

          </div>{/* end RIGHT COLUMN */}
        </div>{/* end 2-COL GRID */}
      </div>
    </div>
  );
}
