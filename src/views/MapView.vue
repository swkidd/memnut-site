<template>
  <div class="text-center fill-height" style="overflow: hidden;">
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>
          Are you sure?
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this marker? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="warning" @click="deleteMarker(currentMarker.id)">
            DELETE
          </v-btn>
          <v-btn text @click="deleteDialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-navigation-drawer v-model="navDrawer" absolute bottom hide-overlay>
      <v-card v-if="currentMarker" class="mx-auto my-12" elevation="0">
        <v-card-text>
          <v-img
            max-height="250"
            class="ma-5"
            :src="currentMarker.image"
            @click="openDetailPage(currentMarker.id, i)"
          />
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="flex-column">
            <v-btn text @click="showImageUpload(false)">
              Add Image to Marker
            </v-btn>
            <v-btn text color="warning" @click="deleteDialog = true">
              Delete Marker
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
    <google-sign-in-button
      class="floating-button"
      style="right: 10px; top: 10px;"
    />
    <v-btn
      fab
      class="floating-button"
      :style="locationButtonStyle"
      :color="following ? 'blue' : 'default'"
      @click="following = !following"
    >
      <v-icon>mdi-map-marker-outline</v-icon>
    </v-btn>
    <v-btn
      fab
      class="floating-button"
      :style="floatingButtonStyle"
      @click="showImageUpload(true)"
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
    <main-map
      :following="following"
      @click="mapClick($event)"
      @markerClick="
        currentMarker = $event;
        navDrawer = true;
      "
    />
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
      navDrawer: false,
      deleteDialog: false,
      currentMarker: null,
      model: true,
      carosel: 0,
      following: false,
      dialog: {
        buttons: false
      },
      clickable: false,
      image: {
        trigger: false,
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
    openDetailPage(id, imageIndex) {
      const routeData = this.$router.resolve({
        name: 'marker-detail',
        params: { id, imageIndex }
      });
      window.open(routeData.href, '_blank');
    },
    deleteMarker(id) {
      Marker.delete(id);
      this.navDrawer = false;
      this.currentMarker = null;
      this.deleteDialog = false;
    },
    showImageUpload(isMarkerImage) {
      this.$refs.imageUpload.$refs.input.click();
      this.isMarkerImage = isMarkerImage;
    },
    addImage(file) {
      this.image = file;
      this.fileType = file.type;
      if (this.isMarkerImage) {
        this.clickable = true;
        this.isMarkerImage = false;
      } else {
        // this.addImageToMarker(this.currentMarker);
      }
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
        Marker.uploadMarker(marker, this.fileType);
        this.image = { trigger: false };
        this.clickable = false;
      }
      this.navDrawer = false;
    },
    addImageToMarker(marker) {
      Marker.addImageToMarker(marker, this.image, this.fileType);
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
