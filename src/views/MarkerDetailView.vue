<template>
  <v-card v-show="marker">
    <v-card-text>
      <v-row justify="center" class="flex-column align-center">
        <v-col style="max-width: 700px;">
          <img-canvas
            :url="marker.image"
            :mems="marker.mems"
            :getMems="getMems"
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
import Marker from "@/models/Marker";
import Mem from "@/models/Mem";
export default {
  components: { ImgCanvas: () => import("@/components/ImgCanvas") },
  name: "MarkerDetailView",
  props: {
    dialog: {
      type: Boolean,
      required: false,
      default: false,
    },
    // markerMems
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
      getMems: false,
    };
  },
  created() {
    Mem.fetch();
  },
  watch: {
    dialog (newVal, oldVal) {
      if (!newVal && oldVal) {
        this.getMems = true;
      }
    }
  },
  computed: {
    allMems() {
      return Mem.query()
        .withAllRecursive()
        .get();
    },
    mems: {
      get() {
        return this.marker.mems.map((markerMem) => markerMem.mem);
      },
      set(val) {
        const currIds = this.marker.mems.map((v) => v.mem.id);
        const newMems = val.filter((mem) => !currIds.includes(mem.id));
        if (newMems.length === 0) return
        this.marker.mems = [
          ...this.marker.mems,
          ...newMems.map((mem, i) => ({
            order: this.marker.mems.length + i,
            mem_id: mem.id,
            mem,
            left: 0,
            top: 0,
            scaleX: 1,
            scaleY: 1,
            width: null,
          })),
        ]
        Marker.insert({ data: this.marker })
      },
    },
    hasMems() {
      return this.mems.length > 0;
    },
  },
  methods: {
    doneAddingMems() {
      this.$emit("dialog", false);
    },
    gotMems(mems) {
      this.marker.mems = mems
      Marker.insert({ data: this.marker })
      this.getMems = false;
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
