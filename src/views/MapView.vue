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
      @click="dialog.addImage = true"
    >
      <v-icon>mdi-map-marker-outline</v-icon>
    </v-btn>
    <v-btn
      fab
      class="floating-button"
      :style="floatingButtonStyle"
      @click="dialog.addImage = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-card
      :width="cardWidth"
      class="pa-5 image-dialog"
      v-show="dialog.addImage"
    >
      <v-card-text>
        <img-canvas
          :imageTrigger="image.trigger"
          @change="image.jpeg = $event"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addMarker">Add</v-btn>
        <v-btn text @click="cancelAddMarker">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <main-map @click="mapClick($event)" />
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
    ImgCanvas: () => import("@/components/ImgCanvas"),
    GoogleSignInButton: () => import("@/components/GoogleSignInButton")
  },
  data() {
    return {
      model: true,
      carosel: 0,
      dialog: {
        addImage: false,
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
        bottom: this.$vuetify.breakpoint.mobile ? "120px" : "70px"
      };
    },
    floatingButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "50px" : "10px"
      };
    },
    cardWidth() {
      if (this.$vuetify.breakpoint.mobile) {
        return 300;
      } else {
        return 400;
      }
    },
  },
  methods: {
    keydown(e) {
      this.$emit("keydown", e);
    },
    cancelAddMarker() {
      this.dialog.addImage = false;
    },
    addMarker() {
      this.image.trigger = true;
      this.clickable = true;
      this.dialog.addImage = false;
    },
    mapClick(e) {
      if (this.clickable) {
        const marker = {
          latlng: e.latlng,
          image: this.image.jpeg
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

.image-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 500;
  transform: translate(-50%, -50%);
}
</style>
