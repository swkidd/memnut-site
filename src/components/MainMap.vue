<template>
  <div>
    <l-map
      ref="map"
      v-bind="$attrs"
      :center="center"
      :zoom="zoom"
      style="z-index: 0;"
      @click="mapClick"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        :ref="`marker${marker.id}`"
        v-for="(marker, i) in markers.filter(m => m.latlng)"
        :key="i"
        :lat-lng="marker.latlng"
        @click="markerClick(marker)"
      >
        >
        <!-- <l-popup v-if="marker.image">
          <v-card class="mx-auto my-12" max-width="374" elevation="0">
            <v-img height="150" class="ma-5" :src="marker.image" />
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="
                  $router.push({
                    name: 'marker-detail',
                    params: { id: marker.id }
                  })
                "
              >
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </l-popup> -->
      </l-marker>
    </l-map>
    <v-card
      justify="start"
      class="d-flex flex-row marker-image"
      :style="scrollStyles"
    >
      <v-sheet
        v-for="(marker, i) in markers"
        :key="i"
        style="cursor: pointer"
        @click="markerImageClick(marker)"
      >
        <v-img
          :contain="true"
          :src="marker.image"
          width="75"
          aspect-ratio="1"
          class="ma-3"
        />
      </v-sheet>
    </v-card>
  </div>
</template>

<script>
import Marker from "@/models/Marker";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "MainMap",
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  props: {
    navDrawer: {
      type: Boolean,
      required: false,
      default: false
    },
    following: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      center: [35.77, 139.3],
      zoom: 2,
      follow: {
        is: false,
        interval: null,
        marker: null,
        circle: null
      },
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  watch: {
    following(val) {
      if (val && !this.follow.is) {
        this.initFollow();
      } else if (!val && this.follow.is) {
        this.stopFollowing();
      }
    }
  },
  computed: {
    scrollStyles() {
      return this.$vuetify.breakpoint.mobile
        ? {
            maxWidth: "225px",
            left: "10px"
          }
        : this.navDrawer
        ? {
            maxWidth: "500px",
            left: "75%",
            transform: "translateX(-50%)"
          }
        : {
            maxWidth: "500px",
            left: "50%",
            transform: "translateX(-50%)"
          };
    },
    markers() {
      return Marker.query().withAllRecursive().get();
    }
  },
  methods: {
    markerClick(marker) {
      this.$emit("markerClick", marker);
    },
    markerImageClick(marker) {
      if (this.$refs[`marker${marker.id}`].length) {
        this.$refs[`marker${marker.id}`][0].mapObject.openPopup();
      }
      this.zoom = 30;
      setTimeout(() => {
        this.center = { lng: marker.latlng.lng, lat: marker.latlng.lat };
      }, 100);
      this.markerClick(marker);
    },
    locate() {
      this.$refs.map.mapObject.locate({ setView: true });
    },
    initFollow() {
      this.$nextTick(() => {
        this.$refs.map.mapObject.on("locationfound", this.onLocationFound);
        this.$refs.map.mapObject.on("locationerror", this.onLocationError);
        this.locate();
        this.follow.interval = setInterval(this.locate, 3000);
      });
    },
    stopFollowing() {
      this.follow.is = false;
      if (this.follow.interval) {
        clearInterval(this.follow.interval);
        this.follow.interval = null;
      }
      if (this.follow.marker) {
        this.$refs.map.mapObject.removeLayer(this.follow.marker);
      }
      if (this.follow.circle) {
        this.$refs.map.mapObject.removeLayer(this.follow.circle);
      }
    },
    onLocationFound(e) {
      var radius = e.accuracy;
      if (this.follow.interval && !this.follow.is) {
        this.follow.marker = L.marker(e.latlng);
        this.follow.marker.addTo(this.$refs.map.mapObject);
        this.follow.circle = L.circle(e.latlng, radius);
        this.follow.circle.addTo(this.$refs.map.mapObject);
        this.follow.is = true;
      }
    },
    onLocationError(e) {
      alert(e.message);
    },
    mapClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>
<style scoped>
.marker-image {
  position: fixed;
  bottom: 20px;
  overflow-x: auto;
  overflow-y: none;
}
</style>
