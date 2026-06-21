import {
  PAGE_SIZE,
  LEVEL_COLORS,
  LEVEL_NAMES,
  STATUS_LABELS,
  BADGE_TYPE_LABELS,
  EXPIRY_WARNING_DAYS,
  ROLE_DASHBOARD_ROUTES,
} from "@/lib/constants";

describe("constants", () => {
  it("PAGE_SIZE is 10", () => {
    expect(PAGE_SIZE).toBe(10);
  });

  it("EXPIRY_WARNING_DAYS is 30", () => {
    expect(EXPIRY_WARNING_DAYS).toBe(30);
  });

  describe("LEVEL_COLORS", () => {
    it("has entries for all 5 levels A-E", () => {
      expect(Object.keys(LEVEL_COLORS)).toHaveLength(5);
      ["A", "B", "C", "D", "E"].forEach((lvl) => {
        expect(LEVEL_COLORS[lvl]).toBeDefined();
      });
    });
  });

  describe("LEVEL_NAMES", () => {
    it("has entries for all 5 levels", () => {
      expect(LEVEL_NAMES.A).toBe("Júnior");
      expect(LEVEL_NAMES.E).toBe("Líder de Conhecimento");
    });
  });

  describe("STATUS_LABELS", () => {
    it("covers all workflow statuses", () => {
      expect(STATUS_LABELS.open).toBeDefined();
      expect(STATUS_LABELS.submitted).toBeDefined();
      expect(STATUS_LABELS.in_validation).toBeDefined();
      expect(STATUS_LABELS.closed).toBeDefined();
    });
  });

  describe("BADGE_TYPE_LABELS", () => {
    it("covers all badge types", () => {
      expect(BADGE_TYPE_LABELS.level).toBeDefined();
      expect(BADGE_TYPE_LABELS.special).toBeDefined();
      expect(BADGE_TYPE_LABELS.premium).toBeDefined();
    });
  });

  describe("ROLE_DASHBOARD_ROUTES", () => {
    it("has routes for all 4 roles", () => {
      expect(ROLE_DASHBOARD_ROUTES.consultant).toBe("/");
      expect(ROLE_DASHBOARD_ROUTES.talent_manager).toBeDefined();
      expect(ROLE_DASHBOARD_ROUTES.service_line_leader).toBeDefined();
      expect(ROLE_DASHBOARD_ROUTES.admin).toBeDefined();
    });
  });
});
