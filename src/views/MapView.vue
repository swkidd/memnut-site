<template>
  <div class="text-center">
    <google-sign-in-button
      class="floating-button"
      style="right: 10px; top: 10px;"
    />
    <v-btn
      fab
      class="floating-button"
      style="right: 5%; bottom: 50px;"
      @click="dialog.addImage = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-card class="image-dialog" width="90%" v-show="dialog.addImage">
      <v-card-text>
        <img-canvas
          :imageTrigger="image.trigger"
          @change="image.svg = $event"
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
  updated() {
    Marker.fetch();
    console.log(Marker.all())
  },
  data() {
    return {
      model: true,
      dialog: {
        addImage: false,
        buttons: false
      },
      clickable: false,
      image: {
        trigger: false,
        svg: null
      }
    };
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
          image: this.image.svg
        };
        Marker.put({ data: marker });
        this.image = { trigger: false, svg: null };
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
