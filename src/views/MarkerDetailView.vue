<template>
  <v-card v-show="marker" :style="canvasWrapperStyle" v-resize="resizeCanvas">
    <v-row justify="center" class="flex-column">
      <v-col class="d-flex flex-row justify-center align-center">
        <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
      </v-col>
      <v-col>
        <v-row class="mx-10 flex-column">
          <v-col>
            <v-autocomplete
              v-model="mem.selected"
              :items="mems"
              item-text="id"
              label="Add Mems"
              multiple
              outlined
              return-object
              @change="onMemAutocompleteChange"
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
  </v-card>
</template>

<script>
import { fabric } from "fabric";
import Marker from "@/models/Marker";
import Mem from "@/models/Mem";
export default {
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
        selected: [],
        fabricImages: []
      }
    };
  },
  created() {
    Mem.fetch();
  },
  computed: {
    canvasWrapperStyle() {
      const pad = this.$vuetify.breakpoint.mobile ? "10px" : "50px";
      return {
        paddingTop: pad,
        paddingBottom: pad,
        width: "100%",
        height: "100%"
      };
    },
    getWidth() {
      return this.$vuetify.breakpoint.mobile
        ? this.$vuetify.breakpoint.width * 0.8
        : this.$vuetify.breakpoint.width * 0.5;
    },
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
  watch: {
    // '$vuetify.breakpoint.width' () {
    //   this.canvasWidth = this.getWidth
    //   const scaleRatio = this.canvasWidth / this.canvas.getWidth();
    //   this.canvas.setWidth(this.canvasWidth)
    //   this.canvas.setZoom(scaleRatio)
    //   this.canvas.renderAll()
    // },
    marker: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.image) {
          this.initCanvas(val.image);
          this.url = val.image;
        }
      }
    }
  },
  methods: {
    doneAddingMems() {
      this.marker.mems = this.mem.fabricImages.map((fi, index) => {
        return {
          order: index,
          mem_id: fi.mem.id,
          left: fi.fImage.left,
          top: fi.fImage.top,
          scaleX: fi.fImage.scaleX,
          scaleY: fi.fImage.scale
        };
      });
      Marker.update(this.marker);
    },
    onMemAutocompleteChange(items) {
      items.forEach(mem => {
        const image = new Image();
        image.src = mem.image;
        image.onload = () => {
          const fImage = new fabric.Image(image);
          fImage.scaleToWidth(200);
          this.mem.fabricImages = [...this.mem.fabricImages, { mem, fImage }];
          this.canvas.add(fImage);
        };
      });
    },
    resizeCanvas() {
      if (this.canvas) {
        this.canvas.getObjects().forEach(obj => {
          if (obj.get("type") === "image") {
            obj.scaleToWidth(this.getWidth);
            this.canvasWidth = this.getWidth;
            this.canvasHeight = obj.height * (this.getWidth / obj.width);
            this.canvas.setDimensions({
              width: this.getWidth,
              height: this.canvasHeight
            });
          }
        });
      }
    },
    goToMem(mem) {
      const routeData = this.$router.resolve({
        name: "memage-detail",
        params: { id: mem.memage_id }
      });
      window.open(routeData.href, "_blank");
    },
    initCanvas(url) {
      fabric.Image.fromURL(
        url,
        img => {
          const ref = this.$refs.can;

          this.canvasWidth = this.getWidth;
          this.canvasHeight = img.height * (this.getWidth / img.width);

          const canvas = new fabric.Canvas(ref, {
            width: this.canvasWidth,
            height: this.canvasHeight,
            preserveObjectStacking: true,
            allowTouchScrolling: true
          });
          this.canvas = canvas;

          img.scaleToWidth(this.canvasWidth);
          img.selectable = false;
          img.hoverCursor = "default";

          canvas.add(img);
        },
        { crossOrigin: "Anonymous" }
      );
    }
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
