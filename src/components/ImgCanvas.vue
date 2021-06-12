<template>
  <v-row>
    <v-toolbar dense floating>
      <v-btn icon @click="addText">
        <v-icon>mdi-message-text-outline</v-icon>
      </v-btn>

      <v-file-input capture="camera" hide-input @change="addImage" />
    </v-toolbar>
    <v-menu
      v-model="contextMenu.open"
      absolute
      offset-y
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      style="max-width: 600px; z-index: 600;"
    >
      <v-list>
        <v-list-item @click="canvas.remove(contextMenu.element)">Remove Element</v-list-item>
        <v-list-item @click="canvas.bringForward(contextMenu.element)">Bring Forward</v-list-item>
        <v-list-item @click="canvas.sendBackwards(contextMenu.element)">Send Backward</v-list-item>
        <v-list-item @click="canvas.bringToFront(contextMenu.element)">Bring To Front</v-list-item>
        <v-list-item @click="canvas.sendToBack(contextMenu.element)">Send To Back</v-list-item>
      </v-list>
    </v-menu>
    <canvas ref="can" v-bind="$attrs"></canvas>
  </v-row>
</template>

<script>
import { fabric } from "fabric";

export default {
  data() {
    return {
      canvas: null,
      contextMenu: { open: false, x: 0, y: 0, element: null }
    };
  },
  mounted() {
    const ref = this.$refs.can;
    const canvas = new fabric.Canvas(ref, {
      fireRightClick: true,
      stopContextMenu: true
    });
    canvas.on({
      "touch:longpress": event => {
        console.log(event);
      },
      "mouse:down": event => {
        if (event.button === 3 && event.target) {
          this.contextMenu = {
            open: true,
            x: event.e.clientX,
            y: event.e.clientY,
            element: event.target
          };
        }
      }
    });
    this.canvas = canvas;
  },
  methods: {
    addText() {
      var textbox = new fabric.Textbox("Text goes here...", {
        textAlign: "center",
        width: 400
      });
      this.canvas.add(textbox);
    },
    addImage(file) {
      fabric.Image.fromURL(URL.createObjectURL(file), img => {
        this.canvas.add(img);
      });
    },
  }
};
</script>
