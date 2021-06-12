<template>
  <div class="text-center">
    <v-btn fab class="floating-button" @click="dialog.addImage = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-card class="image-dialog" v-show="dialog.addImage" fullscreen>
      <v-card-text height="100%">
        <img-canvas :width="canvasWidth" :height="canvasHeight" />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addMarker">Add</v-btn>
        <v-btn text @click="cancelAddMarker">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <main-map :markers="markers" @click="mapClick($event)" />
    <v-snackbar v-model="clickable" timeout="-1" dark>
      <p class="text-center font-weight-bold">
        Click to add marker
      </p>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "MapView",
  components: {
    MainMap: () => import("@/components/MainMap"),
    ImgCanvas: () => import("@/components/ImgCanvas")
  },
  data() {
    return {
      model: true,
      dialog: {
        addImage: false,
        buttons: false
      },
      markers: [],
      clickable: false
    };
  },
  computed: {
    canvasWidth() {
      return window.innerWidth - 50;
    },
    canvasHeight() {
      return window.innerHeight - 200;
    }
  },
  methods: {
    keydown(e) {
      this.$emit("keydown", e);
    },
    cancelAddMarker() {
      this.dialog.addImage = false;
    },
    addMarker() {
      this.clickable = true;
      this.dialog.addImage = false;
    },
    mapClick(e) {
      if (this.clickable) {
        const marker = {
          latlng: e.latlng,
          image: this.imageURL
        };
        this.markers = [...this.markers, marker];
        this.image = null;
        this.clickable = false;
      }
    }
  }
};
</script>

<style scoped>
.floating-button {
  position: absolute;
  bottom: 50px;
  right: 5%;
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
