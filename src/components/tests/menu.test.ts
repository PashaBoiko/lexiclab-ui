import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Menu from "@/components/Menu.vue";
import * as navigation from "@/services/navigation";
import { useRouter } from "vue-router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

const mockIsAuthorized = vi.hoisted(() => ({ value: true }));

vi.mock("vue-router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/services/navigation", () => ({
  navigateTo: vi.fn(),
}));

vi.mock("@/services/auth/auth.ts", () => ({
  __esModule: true,
  isAuthorized: mockIsAuthorized,
}));

describe("Menu.vue", () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      push: vi.fn(),
    };
    (useRouter as vi.Mock).mockReturnValue(mockRouter);

    vi.clearAllMocks();
  });

  it("Does not render menu items when the user is unauthorized", () => {
    const wrapper = mount(Menu);

    const listItems = wrapper.findAll(".v-list-item");
    expect(listItems.length).toBe(0);
  });

  it("Renders menu items when the user is authorized", () => {
    mockIsAuthorized.value = true;

    const wrapper = mount(Menu, {
      global: {
        plugins: [vuetify],
      },
    });

    const listItems = wrapper.findAll(".v-list-item");

    expect(listItems.length).toBe(5);
    expect(wrapper.text()).toContain("Home");
    expect(wrapper.text()).toContain("Quiz");
    expect(wrapper.text()).toContain("Dictionary");
    expect(wrapper.text()).toContain("Progress");
    expect(wrapper.text()).toContain("Archive");
  });

  it("Navigates to the correct route when a menu item is clicked", async () => {
    mockIsAuthorized.value = true;

    const wrapper = mount(Menu, {
      global: {
        plugins: [vuetify],
      },
    });

    const homeItem = wrapper
      .findAll(".v-list-item")
      .find((item) => item.text() === "Home");

    await homeItem?.trigger("click");

    expect(navigation.navigateTo).toHaveBeenCalledWith(mockRouter, "/");
  });

  it("Navigates to the correct route for each menu item", async () => {
    mockIsAuthorized.value = true;

    const wrapper = mount(Menu, {
      global: {
        plugins: [vuetify],
      },
    });

    const routes = [
      { title: "Home", path: "/" },
      { title: "Quiz", path: "/quiz" },
      { title: "Dictionary", path: "/dictionary" },
      { title: "Progress", path: "/statistic" },
      { title: "Archive", path: "/archive" },
    ];

    for (const route of routes) {
      const item = wrapper
        .findAll(".v-list-item")
        .find((i) => i.text() === route.title);

      await item?.trigger("click");

      expect(navigation.navigateTo).toHaveBeenCalledWith(
        mockRouter,
        route.path,
      );
    }
  });
});
