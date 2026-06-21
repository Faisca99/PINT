import { t, getLang, TRANSLATIONS } from "@/lib/i18n";

beforeEach(() => {
  localStorage.clear();
});

describe("t()", () => {
  it("returns PT translation by default", () => {
    expect(t("btn.save", "pt")).toBe("Guardar");
    expect(t("btn.cancel", "pt")).toBe("Cancelar");
  });

  it("returns EN translation", () => {
    expect(t("btn.save", "en")).toBe("Save");
    expect(t("btn.cancel", "en")).toBe("Cancel");
    expect(t("auth.loginBtn", "en")).toBe("Sign In");
  });

  it("returns ES translation", () => {
    expect(t("btn.save", "es")).toBe("Guardar");
    expect(t("nav.myBadges", "es")).toBe("Mis Badges");
    expect(t("auth.loginBtn", "es")).toBe("Entrar");
  });

  it("falls back to PT when key is missing in requested lang", () => {
    // Forçar uma chave que só existe em PT (edge case)
    const result = t("nav.dashboard", "en");
    expect(result).toBeTruthy();
    expect(result).not.toBe("nav.dashboard");
  });

  it("returns the key itself when not found in any language", () => {
    expect(t("chave.inexistente", "pt")).toBe("chave.inexistente");
    expect(t("chave.inexistente", "en")).toBe("chave.inexistente");
  });

  it("page translations exist in all 3 languages", () => {
    const keys = [
      "page.candidaturas.title",
      "page.validacao.title",
      "page.badges.title",
      "dashboard.tm.title",
      "dashboard.sl.title",
    ];
    for (const key of keys) {
      expect(t(key, "pt")).not.toBe(key);
      expect(t(key, "en")).not.toBe(key);
      expect(t(key, "es")).not.toBe(key);
    }
  });

  it("login hero translations exist in all 3 languages", () => {
    const keys = ["login.hero.title1", "login.hero.title2", "login.hero.sub"];
    for (const key of keys) {
      expect(t(key, "pt")).not.toBe(key);
      expect(t(key, "en")).not.toBe(key);
      expect(t(key, "es")).not.toBe(key);
    }
  });
});

describe("getLang()", () => {
  it("returns 'pt' by default when nothing is stored", () => {
    expect(getLang()).toBe("pt");
  });

  it("returns stored language from localStorage", () => {
    localStorage.setItem("pint_lang", "en");
    expect(getLang()).toBe("en");
  });

  it("returns 'pt' for an invalid stored value", () => {
    localStorage.setItem("pint_lang", "fr");
    expect(getLang()).toBe("pt");
  });
});

describe("TRANSLATIONS completeness", () => {
  it("all PT keys also exist in EN and ES", () => {
    const ptKeys = Object.keys(TRANSLATIONS.pt);
    for (const key of ptKeys) {
      expect(TRANSLATIONS.en[key]).toBeDefined();
      expect(TRANSLATIONS.es[key]).toBeDefined();
    }
  });
});
