<template>
  <v-container fluid v-if="memage">
    <div
      v-if="!imageLoaded"
      style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);"
    >
      <v-progress-circular indeterminate size="56"></v-progress-circular>
    </div>
    <v-dialog v-model="mem.dialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
          fab
          class="floating-button"
          style="bottom: 100px; right: 25px;"
          @click="mem.dialog = true"
        >
          M
        </v-btn>
      </template>
      <v-card class="pa-5" max-width="500">
        <v-card-title>
          <v-row justify="center">
            <v-avatar v-for="(mem, i) in mems" :key="i" class="ma-3">
              <img :src="mem.image" />
            </v-avatar>
          </v-row>
        </v-card-title>
      </v-card>
    </v-dialog>
    <v-dialog v-model="comment.dialog" max-width="500">
      <v-card v-if="comment.current" outlined>
        <v-card-title v-text="comment.current.front" />
        <v-card-text v-text="comment.current.back" />
        <v-card-actions v-if="comment.mem">
          <v-spacer />
          <v-btn text @click="goToMem(comment.mem)">
            Go to Mem
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
          fab
          class="floating-button"
          @click="addMem"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card outlined>
        <v-card-title>
          Create Mem
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="front" label="Front..." outlined />
          <v-textarea v-model="back" label="Back..." outlined />
          <v-switch v-model="mem.wholeImage" label="Use Whole Image" />
          <!-- <v-autocomplete
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
              <v-row justify="center" class="my-3">
                <img height="50" :src="data.item.image" />
              </v-row>
            </template>
          </v-autocomplete> -->
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="startOutline"
            text
            :color="isCreatePoints ? 'green' : 'default'"
            >Outline Mem Image</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12" :md="hasMems ? 8 : 12">
        <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
      </v-col>
      <v-col cols="12" md="4">
        <v-item-group @change="commentClick($event)" multiple>
          <v-item
            v-slot="{ active, toggle }"
            v-for="(comment, i) in mems"
            :key="i"
          >
            <v-card
              :color="active ? 'primary' : 'default'"
              class="mb-3 text-center"
              style="max-width: 500px;"
              width="100%"
              @click="comment.polygon ? toggle : commentClick([i])"
            >
              <v-card-title>
                <v-list-item>
                  <v-list-item-avatar color="grey darken-3">
                    <v-img
                      class="elevation-6"
                      :src="comment.creator.picture"
                    ></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title
                      class="text-left"
                      v-text="comment.creator.given_name"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-card-title>

              <v-card-text>
                <div v-text="comment.front" />
              </v-card-text>
            </v-card>
          </v-item>
        </v-item-group>
      </v-col>
    </v-row>
    <v-snackbar v-model="isCreateMem" timeout="-1" text>
      <v-row justify="center">
        <v-btn
          text
          @click="addPoint"
          :color="isCreatePoints ? 'green' : 'default'"
        >
          Add Point
        </v-btn>
        <v-btn text @click="clearPoints">
          Clear Points
        </v-btn>
        <v-btn text @click="submit">
          Create Flashcard
        </v-btn>
        <v-btn text @click="cancel">
          Cancel
        </v-btn>
      </v-row>
    </v-snackbar>
  </v-container>
</template>

<script>
import { fabric } from "fabric";
import Memage from "@/models/Memage";
import Mem from "@/models/Mem";
export default {
  name: "MemageDetailView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false,
      points: [],
      polygon: null,
      isCreatePoints: false,
      isCreateMem: false,
      mem: {
        dialog: false,
        wholeImage: false,
        selected: [],
        fabricImages: []
      },
      comment: {
        dialog: false,
        current: null
      },
      canvas: null,
      url: null,
      imageAdded: false,
      front: "",
      back: "",
      dialog: false,
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  created() {
    Mem.fetch();
    Memage.fetch();
  },
  mounted() {
    if (!this.id) {
      this.id = this.$router.params.id;
    }
  },
  computed: {
    getWidth() {
      if (!this.hasMems || this.$vuetify.breakpoint.mobile) {
        return this.$vuetify.breakpoint.width - 30;
      } else {
        return this.$vuetify.breakpoint.width * (8 / 12) - 20;
      }
    },
    mems() {
      return Mem.query()
        .with("creator")
        .where("memage_id", this.id)
        .get();
    },
    hasMems() {
      return this.mems.length > 0;
    },
    memage() {
      return Memage.query()
        .where("id", this.id)
        .with("creator")
        .first();
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
    memage(val) {
      if (!this.imageAdded && val && val.image) {
        const url = val.image;
        this.initCanvas(url);
        this.url = url;
        this.imageAdded = true;
      }
    }
  },
  methods: {
    goToMem(mem) {
      const routeData = this.$router.resolve({
        name: "memage-detail",
        params: { id: mem.memage_id }
      });
      window.open(routeData.href, "_blank");
    },
    addMem() {
      this.dialog = true;
      this.removeFabricImages();
    },
    startOutline() {
      if (this.mem.wholeImage) {
        this.submit();
        this.dialog = false
      } else {
        this.isCreateMem = true;
        this.dialog = false;
        this.mem.selected.forEach(mem => {
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
    addPoint() {
      this.isCreatePoints = true;
    },
    commentClick(commentIndices) {
      this.removeFabricImages();
      commentIndices.forEach(commentIndex => {
        const comment = this.mems[commentIndex];
        if (!comment.polygon) {
          this.comment.current = comment;
          this.comment.dialog = true;
        } else {
          fabric.util.enlivenObjects([comment.polygon], enlivenedObjects => {
            enlivenedObjects.forEach(obj => {
              const scaleFactor = this.canvasWidth / comment.width;
              obj.left = obj.left * scaleFactor;
              obj.top = obj.top * scaleFactor;
              obj.scaleX = obj.scaleY = scaleFactor;

              obj.selectable = false;
              obj.hoverCursor = "pointer";

              obj.on("mouseup", () => {
                this.comment.current = comment;
                this.comment.dialog = true;
              });

              this.polygon = obj;

              this.canvas.add(obj);
            });
            this.canvas.renderAll();
          });
          // comment.mems.forEach(commentMem => {
          //   const image = new Image();
          //   image.src = commentMem.mem.image;
          //   image.onload = () => {
          //     const fImage = new fabric.Image(image);
          //     const scaleFactor = this.canvasWidth / comment.width;
          //     fImage.top = commentMem.top * scaleFactor;
          //     fImage.left = commentMem.left * scaleFactor;
          //     fImage.scaleX = commentMem.scaleX * scaleFactor;
          //     fImage.scaleY = commentMem.scaleY * scaleFactor;
          //     fImage.selectable = false;
          //     fImage.on("mouseup", () => {
          //       this.comment.current = comment;
          //       this.comment.dialog = true;
          //       this.comment.mem = commentMem.mem;
          //     });
          //     this.mem.fabricImages = [
          //       ...this.mem.fabricImages,
          //       { mem: commentMem.mem, fImage }
          //     ];
          //     this.canvas.add(fImage);
          //   };
          // });
        }
      });
    },
    initCanvas(url) {
      fabric.Image.fromURL(
        url,
        img => {
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
            allowTouchScrolling: true
          });
          this.canvas = canvas;

          img.scaleToWidth(this.canvasWidth);
          img.selectable = false;
          img.hoverCursor = "default";

          canvas.add(img);
          this.imageLoaded = true;
          this.initCanvasEvents();
        },
        { crossOrigin: "Anonymous" }
      );
    },
    initCanvasEvents() {
      this.canvas.on({
        "mouse:up": event => {
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
            stroke: "black"
          });
          this.canvas.add(circlePoint);
          this.points = [...this.points, circlePoint];
          this.canvas.bringToFront(circlePoint);
          this.isCreatePoints = false;
        }
      });
    },
    clearPoints() {
      this.points.forEach(point => this.canvas.remove(point));
      this.points = [];
    },
    removeFabricImages() {
      this.mem.fabricImages.forEach(fi => this.canvas.remove(fi.fImage));
      this.mem.fabricImages = [];
      this.canvas.renderAll();
    },
    createPolygon() {
      this.points = [...this.points, fabric.util.object.clone(this.points[0])];
      var poly = new fabric.Polygon(
        this.points.map(point => point.getCenterPoint()),
        {
          stroke: "black",
          strokeWidth: "5",
          fill: "transparent",
          selectable: false
        }
      );
      this.clearPoints();
      this.canvas.add(poly);
      this.polygon = poly;
    },
    submit() {
      if (this.front === "" || this.back === "") return;
      if (this.points.length > 2) {
        this.createPolygon();
      } else if (!this.mem.wholeImage) return;

      // const mems = this.mem.fabricImages.map(fi => {
      //   return {
      //     mem_id: fi.mem.id,
      //     left: fi.fImage.left,
      //     top: fi.fImage.top,
      //     scaleX: fi.fImage.scaleX,
      //     scaleY: fi.fImage.scaleY
      //   };
      // });

      // Comment.put({
      //   order: this.comments.length + 1,
      //   markerId: this.id,
      //   imageIndex: this.imageIndex,
      //   front: this.front,
      //   back: this.back,
      //   polygons,
      //   width: this.canvasWidth,
      //   mems
      // });

      if (this.polygon && !this.mem.wholeImage) {
        const obj = this.polygon;
        const f = new fabric.StaticCanvas(null, {
          width: obj.width,
          height: obj.height
        });
        const images = this.canvas
          .getObjects()
          .filter(o => o.get("type") === "image");

        if (images.length > 0) {
          const image = images[0];
          let clonedImage = fabric.util.object.clone(image);
          clonedImage.left = -1 * obj.left;
          clonedImage.top = -1 * obj.top;
          f.add(clonedImage);
          f.renderAll();
          clonedImage.clipPath = new fabric.Polygon(obj.get("points"), {
            left: 0,
            top: 0,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            absolutePositioned: true
          });

          const memImage = f.toDataURL({
            format: "image/webp"
          });

          const mem = {
            order: this.memage.mem_ids.length + 1,
            memage_id: this.memage.id,
            front: this.front,
            back: this.back,
            width: this.canvasWidth,
            polygon: this.polygon
          };

          fetch(memImage)
            .then(r => r.blob())
            .then(blob => Mem.uploadMem(mem, blob));
        }
      } else if (this.mem.wholeImage) {
        const mem = {
          image_key: this.memage.image_key,
          order: this.memage.mem_ids.length + 1,
          memage_id: this.memage.id,
          front: this.front,
          back: this.back,
          width: this.canvasWidth,
          polygon: this.polygon
        };

        Mem.put(mem);
      }

      this.removeFabricImages();
      this.mem = { dialog: false, selected: [], fabricImages: [] };

      this.clearPoints();
      this.front = "";
      this.back = "";
      this.isCreatePoints = false;
      this.isCreateMem = false;
    },
    cancel() {
      this.clearPoints();
      this.isCreatePoints = false;
      this.isCreateMem = false;
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
