import { useState } from "react";
import { Eye, EyeOff, CheckCircle, Lock } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function FirstLoginScreen() {
  const { navigate } = useApp();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const rules = [
    { label: "Mínimo 8 caracteres", ok: newPw.length >= 8 },
    { label: "Uma maiúscula", ok: /[A-Z]/.test(newPw) },
    { label: "Um número", ok: /[0-9]/.test(newPw) },
    { label: "Passwords coincidem", ok: newPw === confirmPw && confirmPw !== "" },
  ];

  const handleSubmit = () => {
    if (!rules.every((r) => r.ok)) { setError("Por favor cumpra todos os requisitos."); return; }
    setError("");
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <div className="text-center">
          <h2 className="text-slate-800 mb-2">Password alterada!</h2>
          <p className="text-slate-500 text-sm">A sua password foi atualizada com sucesso. Pode agora entrar na plataforma.</p>
        </div>
        <button onClick={() => navigate("c-dashboard")}
          className="w-full py-4 rounded-2xl text-white font-semibold shadow-lg"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Entrar na plataforma
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="px-6 pt-8 pb-6 text-center"
        style={{ background: "linear-gradient(160deg, #0f1f3d 0%, #1a3a6b 100%)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "linear-gradient(135deg, #0066cc, #00a3e0)" }}>
          <Lock size={24} className="text-white" />
        </div>
        <h2 className="text-white">Alterar Password</h2>
        <p className="text-blue-300 text-sm mt-1">Por segurança, defina uma nova password antes de continuar.</p>
      </div>

      <div className="flex-1 px-6 py-6 flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 text-sm">Password atual / temporária</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <Lock size={16} className="text-slate-400" />
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="Password atual" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 text-sm">Nova password</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <Lock size={16} className="text-slate-400" />
            <input type={showNew ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="Nova password" />
            <button onClick={() => setShowNew(!showNew)}>
              {showNew ? <EyeOff size={16} className="text-slate-400" /> : <Eye size={16} className="text-slate-400" />}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-slate-600 text-sm">Confirmar nova password</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
            <Lock size={16} className="text-slate-400" />
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-800 text-sm" placeholder="Confirmar password" />
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          {rules.map((rule) => (
            <div key={rule.label} className="flex items-center gap-2 py-0.5">
              <span className={rule.ok ? "text-emerald-500" : "text-slate-300"}>✓</span>
              <span className={`text-xs ${rule.ok ? "text-emerald-600" : "text-slate-400"}`}>{rule.label}</span>
            </div>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={!currentPw}
          className="w-full py-4 rounded-2xl text-white font-semibold disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #1a3a6b, #0066cc)" }}>
          Confirmar nova password
        </button>
        <button onClick={() => navigate("login")} className="text-center text-sm text-slate-500">
          Cancelar e voltar ao login
        </button>
      </div>
    </div>
  );
}
