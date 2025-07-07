import { describe, it, expect } from "vitest";
import { createVuetify } from "vuetify/framework";
import { mount } from "@vue/test-utils";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("Breadcrumbs.vue", () => {
  it("Should render the breadcrumbs component", () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { title: "Home", to: "/" },
          { title: "About", to: "/about" },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const links = wrapper.findAll(".v-breadcrumbs-item--link");
    const divider = wrapper.findAll(".v-breadcrumbs-divider");

    expect(links).toHaveLength(2);
    expect(divider).toHaveLength(1);
  });

  it("Should not render breadcrumbs when items are empty", () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const links = wrapper.findAll(".v-breadcrumbs-item--link");
    expect(links).toHaveLength(0);
  });

  it("Test disable property for breadrumbs item", () => {
    const wrapper = mount(Breadcrumbs, {
      props: {
        items: [
          { title: "Home", to: "/" },
          { title: "About", to: "/about", disabled: true },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const disabledListElement = wrapper.findAll(
      ".v-breadcrumbs-item.v-breadcrumbs-item--disabled",
    );
    expect(disabledListElement).toHaveLength(1);

    const disabledLink = wrapper.find(
      ".v-breadcrumbs-item.v-breadcrumbs-item--disabled .v-breadcrumbs-item--link",
    );
    expect(disabledLink.text()).toBe("About");
  });
});
