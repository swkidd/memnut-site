<template>
  <v-card v-show="marker">
    <v-card-text>
      <v-row justify="center" class="flex-column align-center">
        <v-col style="max-width: 700px;">
          <img-canvas
            :url="marker.image"
            :mems="mem.selected"
            :getMems="mem.getMems"
            @gotMems="gotMems($event)"
            selectable
          />
        </v-col>
        <v-col>
          <v-row class="flex-column">
            <v-col>
              <v-autocomplete
                v-model="mem.selected"
                :items="mems"
                item-text="id"
                label="Add Mems"
                multiple
                outlined
                return-object
              >
                <template v-slot:selection="data">
                  <v-avatar left class="ma-1">
                    <v-img :src="data.item.image"></v-img>
                  </v-avatar>
                </template>
                <template v-slot:item="data">
                  <v-row>
                    <v-list-item>
                      <v-list-item-avatar class="mx-5">
                        <img height="50" :src="data.item.image" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="data.item.front"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-row>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-spacer />
              <v-btn @click="doneAddingMems">
                Done
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Marker from "@/models/Marker";
import Mem from "@/models/Mem";
import ImgCanvas from "../components/ImgCanvas.vue";
export default {
  components: { ImgCanvas },
  name: "MarkerDetailView",
  props: {
    marker: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      canvas: null,
      url: null,
      canvasWidth: 0,
      canvasHeight: 0,
      mem: {
        getMems: false,
        selected: [],
      }
    };
  },
  created() {
    Mem.fetch();
  },
  computed: {
    mems() {
      return Mem.query()
        .with("creator")
        .with("marker")
        .get();
    },
    hasMems() {
      return this.mems.length > 0;
    }
  },
  methods: {
    doneAddingMems() {
      this.mem.getMems = true
      this.$emit("dialog", false)
      this.mem.selected = []
    },
    gotMems(mems) {
      this.marker.mems = [...this.marker.mems, ...mems]
      Marker.update(this.marker)
      this.mem.getMems = false
    },
  }
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 50;
}
</style>
