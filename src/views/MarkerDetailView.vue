<template>
  <v-container fluid v-if="marker">
    <v-dialog v-model="comment.dialog" max-width="500">
      <v-card v-if="comment.current" outlined>
        <v-card-title v-text="comment.current.front" />
        <v-card-text v-text="comment.current.back" />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
          fab
          class="floating-button"
          @click="dialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card outlined>
        <v-card-title>
          Add Flashcard
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="front" label="Front..." outlined />
          <v-textarea v-model="back" label="Back..." outlined />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="
              isCreatePoints = true;
              dialog = false;
            "
            text
            :color="isCreatePoints ? 'green' : 'default'"
            >Add Polygon</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-col cols="12" :md="hasComments ? 8 : 12">
        <canvas ref="can" :width="canvasWidth" :height="canvasHeight"></canvas>
      </v-col>
      <v-col cols="12" md="4" class="my-3">
        <v-card
          v-for="(comment, i) in comments"
          :key="i"
          class="my-3 text-center"
          style="max-width: 500px;"
          width="100%"
          @click="commentClick(comment)"
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
                  v-text="comment.creator.first_name"
                />
              </v-list-item-content>
            </v-list-item>
          </v-card-title>

          <v-card-text>
            <div v-text="comment.front" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="isCreatePoints" timeout="-1">
      <v-row justify="center">
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
import Marker from "@/models/Marker";
import Comment from "@/models/Comment";
export default {
  name: "MarkerDetailView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      points: [],
      polygons: [],
      isCreatePoints: false,
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
  mounted() {
    if (!this.id) {
      this.id = this.$router.params.id;
    }
    Marker.fetch();
    Comment.fetchById(this.id);
  },
  computed: {
    getWidth() {
      if (!this.hasComments || this.$vuetify.breakpoint.mobile) {
        return this.$vuetify.breakpoint.width - 30;
      } else {
        return this.$vuetify.breakpoint.width * (8 / 12) - 20;
      }
    },
    marker() {
      return Marker.query()
        .where("id", this.id)
        .with("creator")
        .first();
    },
    comments() {
      console.log(
        Comment.query()
          .where("markerId", this.id)
          .with("creator")
          .get()
      );
      return Comment.query()
        .where("markerId", this.id)
        .with("creator")
        .get();
    },
    hasComments() {
      return this.comments.length > 0;
    }
  },
  watch: {
    marker(val) {
      if (!this.imageAdded && val && val.image) {
        this.initCanvas(val.image);
        this.url = val.image;
        this.imageAdded = true;
      }
    }
  },
  methods: {
    commentClick(comment) {
      this.comment.current = comment;
      this.clearPolygons();
      fabric.util.enlivenObjects(comment.polygons, enlivenedObjects => {
        enlivenedObjects.forEach(obj => {
          const scaleFactor = this.canvasWidth / comment.width;
          obj.left = obj.left * scaleFactor;
          obj.top = obj.top * scaleFactor;
          obj.scaleX = obj.scaleY = scaleFactor;

          obj.selectable = false;
          obj.hoverCursor = "pointer";

          obj.on("mouseup", () => {
            this.comment.dialog = true;
          });

          this.polygons = [...this.polygons, obj];

          this.canvas.add(obj);
        });
        this.canvas.renderAll();
      });
    },
    initCanvas(url) {
      fabric.Image.fromURL(url, img => {
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
        fabric.Object.prototype.selectable = false;

        img.scaleToWidth(this.canvasWidth);
        img.selectable = false;
        img.hoverCursor = "default";

        canvas.add(img);
        this.initCanvasEvents();
      });
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
            selectable: false,
            originX: "center",
            originY: "center",
            hoverCursor: "auto",
            strokeWidth: "2",
            stroke: "black"
          });
          this.canvas.add(circlePoint);
          this.points = [...this.points, circlePoint];
          this.canvas.bringToFront(circlePoint);
        }
      });
    },
    clearPoints() {
      this.points.forEach(point => this.canvas.remove(point));
      this.points = [];
    },
    clearPolygons() {
      this.polygons.forEach(polygon => this.canvas.remove(polygon));
      this.polygons = [];
    },
    createPolygon() {
      if (this.points.length < 3) return;
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
      this.polygons = [...this.polygons, poly];
    },
    submit() {
      this.clearPolygons();
      this.createPolygon();
      this.clearPoints();

      if (this.polygons.length < 1) return;

      Comment.put({
        markerId: this.id,
        front: this.front,
        back: this.back,
        polygons: this.polygons,
        width: this.canvasWidth
      });

      this.clearPoints();
      this.clearPolygons();
      this.front = "";
      this.back = "";
      this.isCreatePoints = false;
      if (this.comments.length === 1) {
        setTimeout(() => {
          this.$router.go();
        }, 1000);
      }
    },
    cancel() {
      this.clearPoints();
      this.clearPolygons();
      this.isCreatePoints = false;
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
