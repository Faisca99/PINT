import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, ChevronLeft, Mail, Lock, User, Building, CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getAreas, register, forgotPassword, resetPassword, type Area } from "../../services/authService";

// Splash Screen — checks stored auth and ?verify= URL param
export function SplashScreen() {
  const { navigate, isAuthenticated } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const verifyToken = params.get("verify");
      if (verifyToken) {
        navigate("c-badge-verify", { token: verifyToken });
        return;
      }
      navigate(isAuthenticated ? "c-dashboard" : "onboarding");
    }, 1500);
    return () => clearTimeout(t);
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f1f3d 0%, #1a3a6b 50%, #0066cc 100%)" }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00a3e0, transparent)" }} />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0066cc, transparent)" }} />
        {[...Array(16)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 rounded-full bg-white opacity-20"
            style={{ top: `${(i * 37 + 5) % 100}%`, left: `${(i * 53 + 10) % 100}%` }} />
        ))}
      </div>
      <div className="relative flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #0066cc, #00a3e0)" }}>
          <span className="text-4xl">🏅</span>
        </div>
        <div className="text-center">
          <p className="text-blue-300 text-sm font-medium tracking-widest uppercase mb-1">Softinsa · IBM</p>
          <h1 className="text-white text-3xl font-bold mb-1">PINT 2025</h1>
          <p className="text-blue-200 text-sm">Digital Badges Platform</p>
        </div>
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Onboarding Screen
export function OnboardingScreen() {
  const { navigate } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    { emoji: "🚀", title: "Evolui as tuas competências", desc: "Conquista badges digitais que certificam as tuas competências técnicas e profissionais.", color: "#0066cc" },
    { emoji: "📎", title: "Submete evidências", desc: "Faz upload dos teus certificados, projetos e conquistas para validação pelos líderes.", color: "#8b5cf6" },
    { emoji: "🌟", title: "Partilha conquistas profissionais", desc: "Partilha os teus badges no LinkedIn e na tua assinatura de email. Destaca-te!", color: "#10b981" },
  ];

  const cur = slides[slide];
  return (
    <div className="flex-1 flex flex-col" style={{ background: "linear-gradient(180deg, #f0f4f8 0%, #ffffff 100%)" }}>
      <div className="flex justify-end px-4 py-3">
        <button onClick={() => navigate("login")} className="text-sm text-slate-400 font-medium">Saltar</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${cur.color}22, ${cur.color}44)` }}>
          <span className="text-7xl">{cur.emoji}</span>
        </div>
        <div className="text-center">
          <h2 className="text-slate-800 mb-3">{cur.title}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">{cur.desc}</p>
        </div>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all ${i === slide ? "w-6 bg-blue-600" : "w-2 bg-slate-200"}`} />
          ))}
        </div>
      </div>
      <div className="px-6 pb-8">
        {slide < slides.length - 1 ? (
          <button onClick={() => setSlide(slide + 1)}
            className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Próximo <ArrowRight size={18} />
          </button>
        ) : (
          <button onClick={() => navigate("login")}
            className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
            Começar <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

// Login Screen — with real API
export function LoginScreen() {
  const { navigate, login } = useApp();
  const [email, setEmail] = useState("abreu@softinsa.pt");
  const [password, setPassword] = useState("Softinsa2025!");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"PT" | "EN" | "ES">("PT");

  const handleLogin = async () => {
    if (!email || !password) { setError("Por favor preencha todos os campos."); return; }
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.mustChangePassword) {
        navigate("c-change-password", { firstLogin: true });
      } else {
        navigate("c-dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Credenciais inválidas. Verifique o email e a password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="pt-4 pb-8 px-6 flex flex-col items-center relative"
        style={{ background: "linear-gradient(160deg, #0f1f3d 0%, #1a3a6b 100%)" }}>
        <div className="self-end flex gap-2 mb-4">
          {(["PT", "EN", "ES"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${lang === l ? "bg-white text-blue-800" : "text-blue-300 hover:text-white"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
          style={{ background: "linear-gradient(135deg, #0066cc, #00a3e0)" }}>
          <span className="text-3xl">🏅</span>
        </div>
        <h2 className="text-white">PINT 2025</h2>
        <p className="text-blue-300 text-sm">Bem-vindo de volta!</p>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 text-sm">Email</label>
          <div className={`flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border ${error && !email ? "border-red-400" : "border-slate-200"} focus-within:border-blue-500`}>
            <Mail size={16} className="text-slate-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
              placeholder="email@softinsa.pt" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 text-sm">Password</label>
          <div className={`flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border ${error && !password ? "border-red-400" : "border-slate-200"} focus-within:border-blue-500`}>
            <Lock size={16} className="text-slate-400" />
            <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
              placeholder="••••••••" />
            <button onClick={() => setShowPw(!showPw)}>
              {showPw ? <EyeOff size={16} className="text-slate-400" /> : <Eye size={16} className="text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
              {rememberMe && <span className="text-white text-xs">✓</span>}
            </div>
            <span className="text-sm text-slate-600">Guardar dados</span>
          </label>
          <button onClick={() => navigate("recover-password")} className="text-sm text-blue-600 font-medium">
            Esqueci a password
          </button>
        </div>

        <button onClick={handleLogin} disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base shadow-lg disabled:opacity-60 transition-opacity"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          {loading ? "A entrar..." : "Entrar"}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <button onClick={() => navigate("register")}
          className="w-full py-3 rounded-2xl border-2 border-blue-200 text-blue-700 font-semibold text-sm">
          Criar conta
        </button>
      </div>
    </div>
  );
}

// Register Screen — fetches areas from API
export function RegisterScreen() {
  const { navigate, goBack } = useApp();
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    areaId: "", rgpd: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getAreas().then(setAreas).catch(() => {});
  }, []);

  const passwordRules = [
    { label: "Mínimo 8 caracteres", ok: form.password.length >= 8 },
    { label: "Uma letra maiúscula", ok: /[A-Z]/.test(form.password) },
    { label: "Um número", ok: /[0-9]/.test(form.password) },
    { label: "Passwords coincidem", ok: form.password.length > 0 && form.password === form.confirmPassword },
  ];
  const pwOk = passwordRules.every((r) => r.ok);

  const handleRegister = async () => {
    if (!form.rgpd) { setError("Deve aceitar as políticas RGPD."); return; }
    setLoading(true);
    setError("");
    try {
      await register({
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        area_id: form.areaId ? Number(form.areaId) : undefined,
      });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-slate-800 mb-2">Bem-vindo!</h2>
          <p className="text-slate-500 text-sm">
            A conta foi criada com sucesso. Foi enviado um email de confirmação para{" "}
            <strong>{form.email}</strong>.
          </p>
        </div>
        <button onClick={() => navigate("login")}
          className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Ir para o Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-3">
        <button onClick={step === 1 ? goBack : () => setStep(1)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <h3 className="text-slate-800">Criar Conta</h3>
          <div className="flex gap-1 mt-1">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 rounded-full flex-1 transition-colors ${s <= step ? "bg-blue-600" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white px-6 py-6 flex flex-col gap-4">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}

        {step === 1 ? (
          <>
            <h3 className="text-slate-700">Dados pessoais</h3>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-slate-600 text-sm">Nome</label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                  <User size={14} className="text-slate-400" />
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-800" placeholder="Nome" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-slate-600 text-sm">Apelido</label>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                  <User size={14} className="text-slate-400" />
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-800" placeholder="Apelido" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Email</label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                <Mail size={14} className="text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800" placeholder="email@softinsa.pt" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Password</label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                <Lock size={14} className="text-slate-400" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800" placeholder="••••••••" />
                <button onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={14} className="text-slate-400" /> : <Eye size={14} className="text-slate-400" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Confirmar Password</label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                <Lock size={14} className="text-slate-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800" placeholder="••••••••" />
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl px-3 py-2 flex flex-col gap-1">
              {passwordRules.map((r) => (
                <span key={r.label} className={`text-xs ${r.ok ? "text-emerald-600" : "text-slate-400"}`}>
                  {r.ok ? "✓" : "○"} {r.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-slate-700">Área profissional</h3>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Área</label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-3 border border-slate-200">
                <Building size={14} className="text-slate-400" />
                <select value={form.areaId} onChange={(e) => setForm({ ...form, areaId: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm text-slate-800 appearance-none">
                  <option value="">Selecionar área</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.service_line_name})</option>)}
                </select>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Ao criar conta, aceito a <span className="text-blue-600 font-medium">Política de Privacidade</span> e os{" "}
                <span className="text-blue-600 font-medium">Termos de Uso</span> da plataforma PINT 2025, incluindo a
                política de tratamento de dados RGPD.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => setForm({ ...form, rgpd: !form.rgpd })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${form.rgpd ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                  {form.rgpd && <span className="text-white text-xs">✓</span>}
                </div>
                <span className="text-sm text-slate-700 font-medium">Aceito as políticas RGPD</span>
              </label>
            </div>
          </>
        )}

        <div className="mt-auto pt-4">
          {step === 1 ? (
            <button onClick={() => setStep(2)} disabled={!pwOk || !form.firstName || !form.email}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              Próximo
            </button>
          ) : (
            <button onClick={handleRegister} disabled={!form.rgpd || loading}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Recover Password Screen — 3 steps: email → new password → success
export function RecoverPasswordScreen() {
  const { goBack } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendEmail = async () => {
    if (!email) { setError("Por favor insira o seu email."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setToken(res.reset_token ?? "");
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao enviar email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) { setError("Preencha todos os campos."); return; }
    if (newPassword !== confirmPassword) { setError("As passwords não coincidem."); return; }
    if (newPassword.length < 8) { setError("A password deve ter pelo menos 8 caracteres."); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao redefinir a password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <button onClick={step === 1 ? goBack : () => setStep((s) => (s > 1 ? (s - 1 as 1 | 2 | 3) : s))}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100">
          <ChevronLeft size={20} className="text-slate-600" />
        </button>
        <h3 className="text-slate-800">Recuperar Password</h3>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col gap-5">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}

        {step === 1 && (
          <>
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Mail size={28} className="text-blue-600" />
              </div>
              <p className="text-slate-500 text-sm">Introduza o seu email e enviaremos instruções para redefinir a password.</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Email</label>
              <div className={`flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border ${error && !email ? "border-red-400" : "border-slate-200"} focus-within:border-blue-500`}>
                <Mail size={16} className="text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="email@softinsa.pt" />
              </div>
            </div>
            <button onClick={handleSendEmail} disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              {loading ? "A enviar..." : "Enviar Instruções"}
            </button>
            <button onClick={goBack} className="text-center text-sm text-slate-500">Cancelar</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Lock size={28} className="text-blue-600" />
              </div>
              <p className="text-slate-500 text-sm">Defina a sua nova password para <strong>{email}</strong>.</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Nova Password</label>
              <div className={`flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border ${error && !newPassword ? "border-red-400" : "border-slate-200"} focus-within:border-blue-500`}>
                <Lock size={16} className="text-slate-400" />
                <input type={showPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="••••••••" />
                <button onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={16} className="text-slate-400" /> : <Eye size={16} className="text-slate-400" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-slate-600 text-sm">Confirmar Password</label>
              <div className={`flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border ${error && !confirmPassword ? "border-red-400" : "border-slate-200"} focus-within:border-blue-500`}>
                <Lock size={16} className="text-slate-400" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="••••••••" />
              </div>
            </div>
            <button onClick={handleResetPassword} disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              {loading ? "A redefinir..." : "Redefinir Password"}
            </button>
            <button onClick={() => { setStep(1); setError(""); }} className="text-center text-sm text-slate-500">Cancelar</button>
          </>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="text-slate-800 mb-2">Password redefinida!</h3>
              <p className="text-slate-500 text-sm font-medium">A sua password foi redefinida com sucesso.</p>
              <p className="text-slate-400 text-sm mt-1">Pode agora fazer login com a sua nova password.</p>
            </div>
            <button onClick={goBack}
              className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
              style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
              Voltar ao Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Confirm Email Screen
export function ConfirmEmailScreen() {
  const { navigate } = useApp();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <CheckCircle size={40} className="text-emerald-600" />
      </div>
      <div className="text-center">
        <h2 className="text-slate-800 mb-2">Email Confirmado!</h2>
        <p className="text-slate-500 text-sm">O seu email foi confirmado com sucesso. Já pode aceder à plataforma PINT 2025.</p>
      </div>
      <button onClick={() => navigate("login")}
        className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
        style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
        Entrar
      </button>
    </div>
  );
}
