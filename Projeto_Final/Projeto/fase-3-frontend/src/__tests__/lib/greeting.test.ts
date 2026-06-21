import { getGreeting } from "@/lib/greeting";
import type { CurrentUser } from "@/lib/user-context";

const mockUser: CurrentUser = {
  id: 1,
  name: "Francisco Abreu",
  email: "abreu@softinsa.pt",
  role: "consultant",
  area: null,
  serviceLine: null,
  accessToken: "token",
  mustChangePassword: false,
  lastLoginAt: null,
};

beforeEach(() => {
  sessionStorage.clear();
});

describe("getGreeting", () => {
  it("returns 'Olá' when user is null", () => {
    expect(getGreeting(null)).toBe("Olá");
  });

  it("returns 'Bem-vindo' on first login and clears the flag", () => {
    sessionStorage.setItem(`first_login_${mockUser.id}`, "true");
    expect(getGreeting(mockUser)).toBe("Bem-vindo");
    expect(sessionStorage.getItem(`first_login_${mockUser.id}`)).toBeNull();
  });

  it("returns 'Seja bem-vindo novamente' after more than 15 days absent", () => {
    const oldDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
    expect(getGreeting(mockUser, oldDate)).toBe("Seja bem-vindo novamente");
  });

  it("does NOT return 'Seja bem-vindo novamente' if absent less than 15 days", () => {
    const recentDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const result = getGreeting(mockUser, recentDate);
    expect(result).not.toBe("Seja bem-vindo novamente");
  });

  it("returns 'Bom dia' between 06h and 11h59", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-20T09:00:00"));
    expect(getGreeting(mockUser)).toBe("Bom dia");
    jest.useRealTimers();
  });

  it("returns 'Boa tarde' between 12h and 19h59", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-20T15:00:00"));
    expect(getGreeting(mockUser)).toBe("Boa tarde");
    jest.useRealTimers();
  });

  it("returns 'Boa noite' between 20h and 05h59", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-05-20T22:00:00"));
    expect(getGreeting(mockUser)).toBe("Boa noite");
    jest.useRealTimers();
  });
});
