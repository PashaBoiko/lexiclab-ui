import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, fa } from "vuetify/iconsets/fa";

import "vuetify/styles";
import "@fortawesome/fontawesome-free/css/all.css";

export default createVuetify({
  components: {
    ...components,
  },
  directives,
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#363538",
          text: "#363538",
        },
      },
    },
  },
});
