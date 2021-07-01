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
            height="250"
            class="ma-5"
            :src="currentMarker.image"
            @click="
              $router.push({
                name: 'marker-detail',
                params: { id: currentMarker.id }
              })
            "
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="deleteDialog = true">
            Delete Marker
          </v-btn>
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
    deleteMarker(id) {
      Marker.delete(id);
      this.navDrawer = false;
      this.currentMarker = null;
      this.deleteDialog = false;
    },
    showImageUpload() {
      this.$refs.imageUpload.$refs.input.click();
    },
    addImage(file) {
      this.image = file;
      this.clickable = true;
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
        Marker.uploadMarker(marker);
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
