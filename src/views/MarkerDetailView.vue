<template>
  <v-card v-show="marker">
    <v-card-text>
      <v-row justify="center" class="flex-column align-center">
        <v-col style="max-width: 700px;">
          <img-canvas
            :url="marker.image"
            :mems="markerMems"
            :getMems="mem.getMems"
            @gotMems="gotMems($event)"
            selectable
          />
        </v-col>
        <v-col>
          <v-row class="flex-column">
            <v-col>
              <v-autocomplete
                v-model="mems"
                :items="allMems"
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
import Mem from "@/models/Mem";
export default {
  components: { ImgCanvas: () => import("@/components/ImgCanvas") },
  name: "MarkerDetailView",
  props: {
    // markerMems
    value: {
      type: Array,
      required: false,
    },
    marker: {
      type: Object,
      required: false,
    },
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
      },
      memIds: this.value.map(markerMem => markerMem.mem.id),
    };
  },
  created() {
    Mem.fetch();
  },
  computed: {
    allMems() {
      return Mem.query()
        .withAllRecursive()
        .get();
    },
    mems: {
      get() {
        // for autocomplete v-model
        return this.value
          .map((markerMem) => markerMem.mem)
          .filter(mem => this.memIds.includes(mem.id));
      },
      set(val) {
        if (val && !this.mem.getMems) {
          this.memIds = val.map(val => val.id)
          // trigger imgCanvas to emit markerMems (keep fabric in imgCanvas)
          this.mem.getMems = true;
        }
      },
    },
    markerMems: {
      get() {
        // v-model is markerMems while autocomplete and imgCanvas accepts mems
        return this.value.filter((markerMem) =>
          this.memIds.includes(markerMem.mem.id)
        );
      },
      set(val) {
        if (val && !this.mem.getMems) {
          // trigger imgCanvas to emit markerMems (keep fabric in imgCanvas)
          this.mem.getMems = true;
        }
      },
    },
    hasMems() {
      return this.mems.length > 0;
    },
  },
  methods: {
    doneAddingMems() {
      this.$emit("dialog", false);
      this.mem.selected = [];
    },
    gotMems(mems) {
      this.$emit("input", mems);
      this.mem.getMems = false;
    },
  },
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
