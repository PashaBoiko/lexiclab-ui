<template>
  <v-dialog v-model="dialogState" max-width="800">
    <template v-slot:activator="{}">
      <v-file-input
        variant="outlined"
        density="compact"
        label="Photo"
        v-model="formFieldData"
        :rules="formFieldRules"
        @update:modelValue="fileSelected"
        clearable
        accept="image/*"
        :show-size="true"
      ></v-file-input>
    </template>

    <template v-slot:default="{}">
      <v-card title="Update photo">
        <v-card-item class="pa-2">
          <v-row>
            <v-col cols="8">
              <template v-if="addedImage">
                <cropper
                  class="cropper"
                  :src="addedImage"
                  :stencil-props="{
                    aspectRatio: 1,
                  }"
                  foreground-class="cropper--foreground"
                  @change="change"
                />
              </template>
            </v-col>
            <v-col cols="4">
              <template v-if="croppedImage">
                <img
                  :src="croppedImage"
                  alt="Profile"
                  class="cropper--preview"
                />
              </template>
            </v-col>
          </v-row>
        </v-card-item>

        <v-card-actions>
          <v-btn color="success" @click="saveThumbnail" variant="flat">
            Save
          </v-btn>
          <v-btn color="error" @click="clearThumbnail" variant="flat">
            Clear
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import { MAX_FILE_SIZE } from "@/modules/profile/constants";
import { toggleErrorToast } from "@/services/notification";

let croppedCanvas: HTMLCanvasElement;

const formFieldData = ref();
const formFieldRules = [(files: any) => thumbnailValidation(files)];

const addedImage = ref();
const croppedImage = ref();
const dialogState = ref();
const emit = defineEmits(["saveThumbnail", "clearThumbnail"]);

function thumbnailValidation(files: File[]) {
  const file = files[0];
  if (file && file.size > MAX_FILE_SIZE) {
    return false;
  }
  return true;
}

function toggleDialog(state: boolean) {
  dialogState.value = state;
}

//ToDo
function change({ canvas }: any) {
  croppedCanvas = canvas;
  croppedImage.value = canvas.toDataURL();
}

function fileSelected(data: File[]) {
  if (!data.length) return;

  const reader = new FileReader();

  reader.readAsDataURL(data[0]);

  reader.onload = () => {
    addedImage.value = reader.result;

    if (thumbnailValidation(formFieldData.value)) {
      toggleDialog(true);
    } else {
      toggleErrorToast("The file should be less than 2MB");
    }
  };

  reader.onerror = function () {
    console.log(reader.error);
  };
}
function saveThumbnail() {
  croppedCanvas.toBlob((blob: any) => {
    const formData = new FormData();

    formData.append("avatar", blob, "filename.png");
    formData.append("firstName", "John");

    emit("saveThumbnail", formData);
  });

  toggleDialog(false);
}

function clearThumbnail() {
  addedImage.value = "";
  croppedImage.value = "";
  formFieldData.value = [];
  toggleDialog(false);
}
</script>

<style lang="scss">
.cropper {
  &--preview {
    width: 100%;
    height: auto;
    border: 2px dashed black;
  }
}
</style>
