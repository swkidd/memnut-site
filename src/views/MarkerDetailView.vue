<template>
  <v-card
    v-show="marker"
    :style="canvasWrapperStyle"
    v-resize="resizeCanvas"
    class="d-flex flex-row justify-center align-center"
  >
    <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
  </v-card>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "MarkerDetailView",
  props: {
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
    };
  },
  computed: {
    canvasWrapperStyle() {
      const pad = this.$vuetify.breakpoint.mobile ? "10px" : "50px"
      return {
        paddingTop: pad,
        paddingBottom: pad,
        width: "100%",
        height: "100%",
      };
    },
    getWidth() {
      return this.$vuetify.breakpoint.mobile
        ? this.$vuetify.breakpoint.width * 0.8
        : this.$vuetify.breakpoint.width * 0.5;
    },
    mems() {
      return this.marker.mems;
    },
    hasMems() {
      return this.mems.length > 0;
    },
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
      },
    },
  },
  methods: {
    resizeCanvas() {
      if (this.canvas) {
        this.canvas.getObjects().forEach((obj) => {
          if (obj.get("type") === "image") {
            obj.scaleToWidth(this.getWidth);
            this.canvasWidth = this.getWidth;
            this.canvasHeight = obj.height * (this.getWidth / obj.width);
            this.canvas.setDimensions({
              width: this.getWidth,
              height: this.canvasHeight,
            });
          }
        });
      }
    },
    goToMem(mem) {
      const routeData = this.$router.resolve({
        name: "memage-detail",
        params: { id: mem.memage_id },
      });
      window.open(routeData.href, "_blank");
    },
    initCanvas(url) {
      fabric.Image.fromURL(
        url,
        (img) => {
          const ref = this.$refs.can;

          this.canvasWidth = this.getWidth;
          this.canvasHeight = img.height * (this.getWidth / img.width);

          const canvas = new fabric.Canvas(ref, {
            width: this.canvasWidth,
            height: this.canvasHeight,
            preserveObjectStacking: true,
            allowTouchScrolling: true,
          });
          this.canvas = canvas;

          img.scaleToWidth(this.canvasWidth);
          img.selectable = false;
          img.hoverCursor = "default";

          canvas.add(img);
        },
        { crossOrigin: "Anonymous" }
      );
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
