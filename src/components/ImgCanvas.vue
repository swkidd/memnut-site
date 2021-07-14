<template>
  <v-sheet
    ref="canContainer"
    :style="canvasWrapperStyle"
    v-resize="resizeCanvas"
    style="min-width: 200px; min-height: 200px;"
    elevation="0"
  >
    <v-row justify="center" class="flex-column">
      <v-col class="d-flex flex-row justify-center align-center">
        <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "ImageCanvas",
  props: {
    url: {
      type: String,
      required: false,
    },
    selectable: {
      type: Boolean,
      required: false,
      default: false,
    },
    markerMems: {
      type: Boolean,
      required: false,
      default: false,
    },
    mems: {
      type: Array,
      required: false,
    },
    getMems: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      canvas: null,
      canvasWidth: 0,
      canvasHeight: 0,
      mem: {
        selected: [],
        fabricImages: [],
      },
    };
  },
  computed: {
    canvasWrapperStyle() {
      const pad = this.$vuetify.breakpoint.mobile ? "10px" : "50px";
      return {
        paddingTop: pad,
        paddingBottom: pad,
        width: "100%",
        height: "100%",
      };
    },
  },
  watch: {
    getMems(newVal, oldVal) {
      if (!oldVal && newVal) {
        this.$emit(
          "gotMems",
          this.mem.fabricImages.map((fi, index) => {
            return {
              order: index,
              mem_id: fi.mem.id,
              left: fi.fImage.left,
              top: fi.fImage.top,
              scaleX: fi.fImage.scaleX,
              scaleY: fi.fImage.scaleY,
              width: this.canvasWidth,
            };
          })
        );
        this.removeFabricImages();
      }
    },
    url: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.initCanvas(val);
        }
      },
    },
    mems: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && this.canvas) {
          this.initMems(val)
        }
      },
    },
  },
  methods: {
    initMems (mems) {
      if (mems && this.markerMems) {
        this.removeFabricImages();
        // markermems
        mems.forEach((commentMem) => {
          const image = new Image();
          image.src = commentMem.mem.image;
          image.onload = () => {
            const fImage = new fabric.Image(image);
            const scaleFactor = this.canvasWidth / commentMem.width;
            fImage.top = commentMem.top * scaleFactor;
            fImage.left = commentMem.left * scaleFactor;
            fImage.scaleX = commentMem.scaleX * scaleFactor;
            fImage.scaleY = commentMem.scaleY * scaleFactor;
            fImage.selectable = this.selectable;
            fImage.on("mouseup", () => {
              if (this.markerMems) {
                this.goToMem(commentMem.mem);
              }
            });
            this.mem.fabricImages = [
              ...this.mem.fabricImages,
              { mem: commentMem.mem, fImage },
            ];
            this.canvas.add(fImage);
          };
        });
      } else if (mems) {
        mems.forEach((mem) => {
          const image = new Image();
          image.src = mem.image;
          image.onload = () => {
            const fImage = new fabric.Image(image);
            fImage.scaleToWidth(200);
            this.mem.fabricImages = [...this.mem.fabricImages, { mem, fImage }];
            this.canvas.add(fImage);
          };
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
    removeFabricImages() {
      this.mem.fabricImages.forEach((fi) => this.canvas.remove(fi.fImage));
      this.mem.fabricImages = [];
      this.canvas.renderAll();
    },
    getWidth() {
      return this.$refs.canContainer.$el.clientWidth;
      // return this.$vuetify.breakpoint.mobile
      //   ? this.$vuetify.breakpoint.width
      //   : this.$refs.canContainer.$el.clientWidth;
    },
    resizeCanvas() {
      if (this.canvas) {
        this.removeFabricImages();
        this.canvas.getObjects().forEach((obj) => {
          const width = this.getWidth();
          if (obj.get("type") === "image") {
            obj.scaleToWidth(width);
            this.canvasWidth = width;
            this.canvasHeight = obj.height * (width / obj.width);
            this.canvas.setDimensions({
              width,
              height: this.canvasHeight,
            });
          }
        });
        this.initMems(this.mems)
      }
    },
    initCanvas(url) {
      fabric.Image.fromURL(
        url,
        (img) => {
          const ref = this.$refs.can;
          const width = this.getWidth();
          this.canvasWidth = width;
          this.canvasHeight = img.height * (width / img.width);

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
          this.initMems(this.mems)
        },
        { crossOrigin: "Anonymous" }
      );
    },
  },
};
</script>
