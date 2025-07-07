import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Loader from "@/components/Loader.vue";
import { createVuetify } from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

global.ResizeObserver = require("resize-observer-polyfill");

describe("Loader.vue", () => {
  it("Should render the loader component", () => {
    const wrapper = mount(Loader, {
      global: {
        plugins: [vuetify],
      },
    });
    expect(wrapper.find(".ll-loader").exists()).toBe(true);
    expect(wrapper.find(".v-progress-circular").exists()).toBe(true);
  });
});
