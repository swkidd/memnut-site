<template>
  <div class="text-center fill-height" style="overflow: hidden;">
    <v-dialog v-model="addMemDialog" scrollable>
      <marker-detail-view
        v-if="currentMarker"
        :marker="currentMarker"
        :key="currentMarker.id"
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
    >
      <v-card v-if="currentMarker" class="mx-auto my-12" elevation="0">
        <v-card-text>
          <img-canvas :url="currentMarker.image" :mems="mems" marker-mems />
          <v-item-group multiple @change="commentClick($event)">
            <v-item
              v-slot="{ active, toggle }"
              v-for="(comment, i) in currentMarker.mems"
              :key="i"
            >
              <v-card
                :color="active ? 'primary' : 'default'"
                class="mb-3 text-center"
                style="max-width: 500px;"
                width="100%"
                @click="toggle"
              >
                <v-card-title>
                  <v-list-item>
                    <v-list-item-avatar color="grey darken-3">
                      <v-img
                        class="elevation-6"
                        :src="comment.mem.image"
                      ></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="text-left"
                        v-text="comment.mem.front"
                      />
                    </v-list-item-content>
                  </v-list-item>
                </v-card-title>
              </v-card>
            </v-item>
          </v-item-group>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="flex-column">
            <v-btn text @click="addMem(false)">
              Add Mem
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
    MarkerDetailView: () => import("@/views/MarkerDetailView")
  },
  data() {
    return {
      navDrawer: false,
      addMemDialog: false,
      deleteDialog: false,
      markerId: null,
      following: false,
      clickable: false,
      mems: []
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
            width: "100%"
          }
        : {
            height: "100vh",
            width: this.navDrawer ? "50%" : "100%",
            position: "relative",
            left: this.navDrawer ? "50%" : undefined
          };
    },
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
    markerClick(id) {
      this.markerId = id;
      this.navDrawer = true;
    },
    commentClick(commentIndices) {
      this.mems = this.currentMarker.mems.filter((_, index) =>
        commentIndices.includes(index)
      );
    },
    addMem() {
      this.addMemDialog = true;
    },
    openDetailPage(id, imageIndex) {
      const routeData = this.$router.resolve({
        name: "marker-detail",
        params: { id, imageIndex }
      });
      window.open(routeData.href, "_blank");
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
      this.file = file;
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
        Marker.uploadMarker(marker, this.file);
        this.clickable = false;
      }
      this.navDrawer = false;
    }
    // addImageToMarker(marker) {
    // Marker.addImageToMarker(marker, this.image, this.fileType);
    // }
  }
};
</script>

<style scoped>
.floating-button {
  position: absolute;
  z-index: 50;
}
</style>
