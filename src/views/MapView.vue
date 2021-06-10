<template>
  <div>
    <v-dialog v-model="dialog.addImage" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab class="floating-button" v-bind="attrs" v-on="on">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          Add Marker
        </v-card-title>
        <v-card-text>
          <v-img v-if="image" :src="imageURL" />
          <v-file-input
            v-else
            v-model="image"
            label="File input"
            outlined
            dense
            accept="image/*"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="addMarker">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <main-map :markers="markers" @click="mapClick($event)" />
  </div>
</template>

<script>
export default {
  name: "MapView",
  components: {
    MainMap: () => import("@/components/MainMap")
  },
  data() {
    return {
      dialog: {
        addImage: false
      },
      image: null,
      markers: [],
      clickable: false
    };
  },
  computed: {
    imageURL() {
      if (!this.image) return null;
      return URL.createObjectURL(this.image);
    }
  },
  methods: {
    addMarker() {
      this.clickable = true;
      this.dialog.addImage = false;
    },
    mapClick(e) {
      if (this.clickable) {
        this.markers = [...this.markers, { latlng: e.latlng }];
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
