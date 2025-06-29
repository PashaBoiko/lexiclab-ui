import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "@/components/Alert.vue";
import {
  setAlertState,
  toggleSuccessAlert,
  toggleInfoAlert,
} from "@/services/notification";

describe("Alert.vue", () => {
  beforeEach(() => {
    setAlertState();
  });

  it("Does not render the alert as a default", () => {
    const wrapper = mount(Alert);

    expect(wrapper.find(".ll-alert").exists()).toBe(false);
  });

  it("Render the success alert", () => {
    toggleSuccessAlert("Operation completed successfully");

    const wrapper = mount(Alert);

    expect(wrapper.find(".ll-alert").exists()).toBe(true);
    const alert = wrapper.get("v-alert");
    expect(alert.attributes("type")).toBe("success");
    expect(alert.attributes("title")).toBe("Success");
    expect(alert.attributes("text")).toBe("Operation completed successfully");
  });

  it("Reacts to changes in alert state", async () => {
    const wrapper = mount(Alert);
    expect(wrapper.find(".ll-alert").exists()).toBe(false);

    toggleInfoAlert("This is an informational message");

    await wrapper.vm.$nextTick();

    const alert = wrapper.get("v-alert");
    expect(alert.attributes("type")).toBe("info");
    expect(alert.attributes("title")).toBe("info");
    expect(alert.attributes("text")).toBe("This is an informational message");
  });
});
