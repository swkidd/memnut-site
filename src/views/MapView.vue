<template>
  <div class="text-center">
    <v-dialog v-model="dialog.addImage" fullscreen>
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab class="floating-button" v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card width="100%">
        <v-card-title>
          Add Marker
        </v-card-title>
        <v-card-text>
          <v-file-input
            v-model="image"
            label="File input"
            outlined
            dense
            accept="image/*"
          />
          <img-canvas :width="canvasWidth" :height="canvasHeight" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="addMarker">Add</v-btn>
          <v-btn text @click="cancelAddMarker">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    ImgCanvas: () => import('@/components/ImgCanvas')
  },
  data() {
    return {
      model: true,
      dialog: {
        addImage: false
      },
      image: null,
      markers: [],
      clickable: false
    };
  },
  computed: {
    canvasWidth () {
      return window.innerWidth - 50
    },
    canvasHeight () {
      return window.innerHeight - 200
    },
    imageURL() {
      if (!this.image) return null;
      return URL.createObjectURL(this.image);
    }
  },
  methods: {
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
          image: this.imageURL,
        }
        this.markers = [...this.markers, marker ];
        this.image = null
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
</style>
