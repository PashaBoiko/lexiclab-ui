<script setup lang="ts">
import { computed } from "vue";
import { useDisplay } from "vuetify";
import { RouteLocationRaw, useRouter } from "vue-router";

import * as auth from "@/services/auth/auth.ts";
import { navigateTo } from "@/services/navigation";

import errorHandler from "@/utils/error-handler.ts";

const props = defineProps<{
  drawer: boolean;
}>();

const authInfo = auth.authorizedUser;

const router = useRouter();

const userName = computed(() => {
  if (authInfo) return authInfo.name;
  return "";
});

const { mdAndDown, lgAndUp } = useDisplay();

const emit = defineEmits(["toggleDrawer", "toggleRail"]);

const userNameFirstLetter = computed(() => {
  return userName.value.slice(0, 1).toUpperCase();
});

const userEmail = computed(() => {
  if (authInfo) return authInfo.email;
  return "";
});

const userAvatar = computed(() => {
  if (authInfo) return authInfo.avatar && authInfo.avatar.path;
  return "";
});

function navigate(path: RouteLocationRaw) {
  navigateTo(router, path);
}

async function logout() {
  try {
    await auth.logout();
    navigate("/login");
  } catch (err: unknown) {
    errorHandler(err);
  }
}
</script>

<template>
  <v-app-bar color="#fff" prominent>
    <v-app-bar-nav-icon
      v-if="auth.isAuthorized.value && lgAndUp"
      variant="text"
      icon="fa-solid fa-chevron-left"
      @click.stop="emit('toggleRail')"
    />

    <v-app-bar-nav-icon
      v-if="auth.isAuthorized.value && mdAndDown"
      variant="text"
      icon="fa-solid fa-bars"
      @click.stop="emit('toggleDrawer')"
    />

    <template #prepend>
      <div v-if="!props.drawer" class="l-app-bar l-app-bar--mobile">
        <i class="l-app-bar--logo fa-solid fa-flask-vial"></i>
        <span class="l-app-bar--title">LexicLab</span>
      </div>
    </template>

    <v-spacer />

    <template #append>
      <template v-if="!auth.isAuthorized.value">
        <v-btn
          variant="outlined"
          text="login"
          theme="secondary"
          @click="navigate('/login')"
          data-testid="appbar-login-button"
        />
        <v-btn
          variant="text"
          text="Register"
          theme="secondary"
          @click="navigate('/sign-up')"
          data-testid="appbar-sign-up-button"
        />
      </template>

      <template v-else>
        <v-menu min-width="200px" rounded>
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="#8D8C8A" size="40" class="avatar">
                <img
                  class="avatar--image"
                  v-if="userAvatar"
                  alt="Avatar"
                  :src="userAvatar"
                />
                <span v-else class="avatar--text text-h5 text-white">{{
                  userNameFirstLetter
                }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="#8D8C8A" size="44">
                  <img
                    class="avatar--image"
                    v-if="userAvatar"
                    alt="Avatar"
                    :src="userAvatar"
                  />
                  <span v-else class="avatar--text text-h5 text-white">{{
                    userNameFirstLetter
                  }}</span>
                </v-avatar>
                <h3>{{ userName }}</h3>
                <p class="text-caption mt-1">{{ userEmail }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  variant="text"
                  text="Profile"
                  theme="secondary"
                  to="/profile"
                />
                <v-divider class="my-3"></v-divider>
                <v-btn
                  variant="text"
                  text="Log out"
                  theme="secondary"
                  @click="logout"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </template>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.l-app-bar {
  &--title {
    color: #3a3f51;
  }
}

.avatar {
  &--image {
    width: 100%;
    border-radius: 50%;
  }
}
</style>
