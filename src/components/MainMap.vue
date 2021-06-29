<template>
  <div>
    <l-map
      ref="map"
      :center="center"
      :zoom="zoom"
      style="height: 100vh; width: 100%; z-index: 0;"
      @click="mapClick"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        :ref="`marker${marker.id}`"
        v-for="(marker, i) in markers.filter(m => m.latlng)"
        :key="i"
        :lat-lng="marker.latlng"
      >
        <l-popup v-if="marker.image">
          <v-card class="mx-auto my-12" max-width="374" elevation="0">
            <v-img height="250" class="ma-5" :src="marker.image" />
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
        </l-popup>
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
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "MainMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  props: {
    following: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      center: [35.77, 139.3],
      zoom: 13,
      isFollowing: false,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  watch: {
    following(val) {
      if (val && !this.isFollowing) {
        this.initFollow();
      }
    }
  },
  mounted() {
    Marker.fetch();
  },
  computed: {
    scrollStyles() {
      return this.$vuetify.breakpoint.mobile
        ? {
            maxWidth: "225px",
            left: "10px"
          }
        : {
            maxWidth: "500px",
            left: "50%",
            transform: "translateX(-50%)"
          };
    },
    markers() {
      return Marker.all();
    }
  },
  methods: {
    markerImageClick(marker) {
      this.zoom = 24;
      this.center = { lng: marker.latlng.lng, lat: marker.latlng.lat + 0.0005 };
      if (this.$refs[`marker${marker.id}`].length) {
        this.$refs[`marker${marker.id}`][0].mapObject.openPopup();
      }
    },
    initFollow() {
      this.$nextTick(() => {
        this.$refs.map.mapObject.on("locationfound", this.onLocationFound);
        this.$refs.map.mapObject.on("locationerror", this.onLocationError);
        this.$refs.map.mapObject.locate({ setView: true });
      });
      this.isFollowing = true;
    },
    onLocationFound(e) {
      var radius = e.accuracy;

      L.marker(e.latlng).addTo(this.$refs.map.mapObject);

      L.circle(e.latlng, radius).addTo(this.$refs.map.mapObject);
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
