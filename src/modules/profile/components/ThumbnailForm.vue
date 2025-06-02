<template>
  <v-form ref="form">
    <v-card density="comfortable" class="mb-8">
      <v-card-item>
        <v-row>
          <v-col cols="12" class="d-flex align-center">
            <h4 class="text-h6">Upload photo</h4>
          </v-col>
        </v-row>
        <v-row v-if="userAvatar">
          <v-col cols="6" class="d-flex align-center">
            <img width="200px" height="200px" :src="userAvatar" alt="avatar" />
          </v-col>
          <v-col cols="6" class="d-flex align-center justify-end">
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  v-bind="activatorProps"
                  color="error"
                  text="Delete"
                  variant="tonal"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Remove">
                  <v-card-text>
                    Are you sure you want to remove avatar?
                  </v-card-text>

                  <v-card-actions class="d-flex justify-end">
                    <v-btn
                      color="info"
                      variant="tonal"
                      text="Close"
                      @click="isActive.value = false"
                    ></v-btn>
                    <v-btn
                      color="error"
                      variant="tonal"
                      text="Remove"
                      @click="
                        isActive.value = false;
                        removeThumbnail();
                      "
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="6" class="d-flex align-center">
            <thumbnail-pop-up @save-thumbnail="saveThumbnail" />
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import ThumbnailPopUp from "@/modules/profile/components/ThumbnailPopUp.vue";
import { IProfileAvatarPayload } from "@/services/rdo/profile.ts";
import * as auth from "@/services/auth/auth.ts";
import { toggleErrorToast } from "@/services/notification";

const form = ref();
const authInfo = auth.authorizedUser;

const userAvatar = computed(() => {
  if (authInfo) return authInfo.avatar && authInfo.avatar.path;
  return "";
});

async function saveThumbnail(data: IProfileAvatarPayload) {
  try {
    await auth.uploadAvatar(data);
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
}

async function removeThumbnail() {
  try {
    await auth.removeAvatar();
  } catch (err: unknown) {
    toggleErrorToast(err as string);
  }
}
</script>
