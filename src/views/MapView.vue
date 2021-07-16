<template>
  <div class="text-center fill-height" style="overflow: hidden;">
    <v-dialog v-model="addMemDialog" scrollable>
      <marker-detail-view
        v-if="currentMarker"
        v-model="currentMarker.mems"
        :marker="currentMarker"
        @dialog="addMemDialog = $event"
      />
    </v-dialog>
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
    <v-navigation-drawer
      v-model="navDrawer"
      width="50%"
      absolute
      bottom
      hide-overlay
      style="z-index: 2;"
    >
      <v-card v-if="currentMarker" class="mx-auto my-12" elevation="0">
        <v-card-text>
          <v-text-field v-model="currentMarker.title" label="Marker title..." outlined />
          <img-canvas :url="currentMarker.image" :mems="currentMarker.mems" />
          <v-textarea v-model="currentMarker.text" label="Marker text..." outlined />
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="flex-column">
            <v-btn text @click="addMem(false)">
              Edit Mems
            </v-btn>
            <v-btn text @click="saveMarker(currentMarker)" class="mb-5">
              Save Marker
            </v-btn>
            <v-btn text color="warning" @click="deleteDialog = true">
              Delete Marker
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
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
      :navDrawer="navDrawer"
      @click="mapClick($event)"
      @markerClick="markerClick($event)"
      :style="mapStyle"
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
    ImgCanvas: () => import("@/components/ImgCanvas"),
    MainMap: () => import("@/components/MainMap"),
    MarkerDetailView: () => import("@/views/MarkerDetailView"),
  },
  beforeCreate: function() {
    document.body.classList.add("overflow-hidden");
  },
  data() {
    return {
      navDrawer: false,
      addMemDialog: false,
      deleteDialog: false,
      markerId: null,
      following: false,
      clickable: false,
    };
  },
  computed: {
    currentMarker() {
      return Marker.query()
        .where("id", this.markerId)
        .withAllRecursive()
        .first();
    },
    mapStyle() {
      return this.$vuetify.breakpoint.mobile
        ? {
            height: this.navDrawer ? "50vh" : "100vh",
            width: "100%",
            overflow: "hidden",
          }
        : {
            height: "100vh",
            width: this.navDrawer ? "50%" : "100%",
            position: "relative",
            left: this.navDrawer ? "50%" : undefined,
            overflow: "hidden",
          };
    },
    locationButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "130px" : "70px",
      };
    },
    floatingButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "60px" : "10px",
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
    markerClick(id) {
      this.markerId = id;
      this.navDrawer = true;
    },
    addMem() {
      this.addMemDialog = true;
    },
    openDetailPage(id, imageIndex) {
      const routeData = this.$router.resolve({
        name: "marker-detail",
        params: { id, imageIndex },
      });
      window.open(routeData.href, "_blank");
    },
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
      this.file = file;
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
          image: this.image,
        };
        Marker.uploadMarker(marker, this.file);
        this.clickable = false;
      }
      this.navDrawer = false;
    },
    saveMarker(marker) {
      Marker.update(marker)
    }
  },
};
</script>

<style scoped>
.floating-button {
  position: absolute;
  z-index: 1;
}
</style>
