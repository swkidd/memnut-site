<template>
  <div>
    <l-map
      ref="map"
      :zoom="zoom"
      style="height: 100vh; width: 100%; z-index: 0;"
      @click="mapClick"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-marker
        v-for="(marker, i) in markers"
        :key="i"
        :lat-lng="marker.latlng"
      >
        <l-popup v-if="marker.image">
          <v-img :src="marker.image" />
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "MainMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  props: {
    markers: {
      type: Array,
      required: false,
      default: () => []
    },
  },
  data() {
    return {
      zoom: 13,
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.map.mapObject.on("locationfound", this.onLocationFound);
      this.$refs.map.mapObject.on("locationerror", this.onLocationError);
      this.$refs.map.mapObject.locate({ setView: true });
    });
  },
  methods: {
    onLocationFound(e) {
      var radius = e.accuracy;

      L.marker(e.latlng)
        .addTo(this.$refs.map.mapObject)
        .bindPopup("You are within " + radius + " meters from this point")
        .openPopup();

      L.circle(e.latlng, radius).addTo(this.$refs.map.mapObject);
    },
    onLocationError(e) {
      alert(e.message);
    },
    mapClick(e) {
      this.$emit('click', e)
    }
  }
};
</script>
