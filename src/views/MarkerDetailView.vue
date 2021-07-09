<template>
  <v-card
    v-show="marker"
    :style="canvasWrapperStyle"
    v-resize="resizeCanvas"
  >
    <v-container>
      <v-row justify="center">
        <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
      </v-row>
    </v-container>
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
      return {
        paddingTop: "100px",
        paddingBottom: "100px",
        width: this.canvasWidth,
        height: "100%"
      };
    },
    getWidth() {
      return this.$vuetify.breakpoint.width * 0.7;
      // if (!this.hasMems || this.$vuetify.breakpoint.mobile) {
      //   return this.$vuetify.breakpoint.width - 30;
      // } else {
      //   return this.$vuetify.breakpoint.width * (8 / 12) - 20;
      // }
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
          // if (this.canvasHeight > this.$vuetify.breakpoint.height) {
          //   this.canvasHeight = this.$vuetify.breakpoint.height;
          // }

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
          this.initCanvasEvents();
        },
        { crossOrigin: "Anonymous" }
      );
    },
    initCanvasEvents() {
      this.canvas.on({
        "mouse:up": (event) => {
          if (!this.isCreatePoints) return;
          var pointer = this.canvas.getPointer(event.e);
          var positionX = pointer.x;
          var positionY = pointer.y;

          // Add small circle as an indicative point
          var circlePoint = new fabric.Circle({
            radius: 5,
            fill: "white",
            left: positionX,
            top: positionY,
            originX: "center",
            originY: "center",
            hoverCursor: "auto",
            strokeWidth: "2",
            stroke: "black",
          });
          this.canvas.add(circlePoint);
          this.points = [...this.points, circlePoint];
          this.canvas.bringToFront(circlePoint);
          this.isCreatePoints = false;
        },
      });
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
