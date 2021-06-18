<template>
  <div class="text-center">
    <google-sign-in-button
      class="floating-button"
      style="right: 10px; top: 10px;"
    />
    <v-btn
      fab
      class="floating-button"
      :style="locationButtonStyle"
      @click="following = true"
    >
      <v-icon>mdi-map-marker-outline</v-icon>
    </v-btn>
    <v-btn
      fab
      class="floating-button"
      :style="floatingButtonStyle"
      @click="showImageUpload"
    >
      <v-icon>mdi-image-outline</v-icon>
    </v-btn>
    <v-file-input
      v-show="false"
      ref="imageUpload"
      accept="image/*"
      hide-input
      prepend-icon=""
      @change="addImage"
    />
    <main-map :following="following" @click="mapClick($event)" />
    <v-snackbar v-model="clickable" timeout="-1" dark>
      <p class="text-center font-weight-bold">
        Click to add marker
      </p>
    </v-snackbar>
  </div>
</template>

<script>
import Marker from "@/models/Marker";
export default {
  name: "MapView",
  components: {
    MainMap: () => import("@/components/MainMap"),
    GoogleSignInButton: () => import("@/components/GoogleSignInButton")
  },
  data() {
    return {
      model: true,
      carosel: 0,
      following: false,
      dialog: {
        buttons: false
      },
      clickable: false,
      image: {
        trigger: false,
        jpeg: null
      }
    };
  },
  computed: {
    locationButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "130px" : "70px"
      };
    },
    floatingButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "60px" : "10px"
      };
    },
    cardWidth() {
      if (this.$vuetify.breakpoint.mobile) {
        return 300;
      } else {
        return 400;
      }
    }
  },
  methods: {
    showImageUpload() {
      this.$refs.imageUpload.$refs.input.click()
    },
    addImage(file) {
      this.image = file
      this.clickable = true
      Marker.uploadImage(file)
    },
    keydown(e) {
      this.$emit("keydown", e);
    },
    cancelAddMarker() {
      this.dialog.addImage = false;
    },
    mapClick(e) {
      if (this.clickable) {
        const marker = {
          latlng: e.latlng,
          image: this.image
        };
        Marker.put(marker);
        this.image = { trigger: false, jpeg: null };
        this.clickable = false;
      }
    }
  }
};
</script>

<style scoped>
.floating-button {
  position: absolute;
  z-index: 50;
}
</style>
