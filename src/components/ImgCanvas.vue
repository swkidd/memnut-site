<template>
  <v-row>
    <v-toolbar>
      <v-btn icon @click="addText">
        <v-icon>mdi-message-text-outline</v-icon>
      </v-btn>

      <v-file-input
        accept="image/*"
        capture="camera"
        hide-input
        @change="addImage"
      />
      <v-spacer />

      <color-picker
        v-if="currentObjectType === 'textbox'"
        class="mx-3"
        :color="color.background"
        icon="mdi-format-color-fill"
        @change="setAttr('backgroundColor', $event)"
      />
      <color-picker
        v-if="currentObjectType === 'textbox'"
        class="mx-3"
        :color="color.text"
        icon="mdi-format-color-text"
        @change="setAttr('fill', $event)"
      />
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
        <v-list-item @click="canvas.remove(contextMenu.element)"
          >Remove Element</v-list-item
        >
        <v-list-item @click="canvas.bringForward(contextMenu.element)"
          >Bring Forward</v-list-item
        >
        <v-list-item @click="canvas.sendBackwards(contextMenu.element)"
          >Send Backward</v-list-item
        >
        <v-list-item @click="canvas.bringToFront(contextMenu.element)"
          >Bring To Front</v-list-item
        >
        <v-list-item @click="canvas.sendToBack(contextMenu.element)"
          >Send To Back</v-list-item
        >
      </v-list>
    </v-menu>
    <canvas ref="can" v-bind="$attrs"></canvas>
  </v-row>
</template>

<script>
import { fabric } from "fabric";
import ColorPicker from "./ColorPicker.vue";

export default {
  components: { ColorPicker },
  data() {
    return {
      canvas: null,
      currentObject: null,
      color: {
        background: "#FFFFFF",
        text: "#000000"
      },
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
        if (event.target) {
          this.contextMenu = {
            open: true,
            x: event.e.clientX,
            y: event.e.clientY,
            element: event.target
          };
        }
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
      },
      "selection:created": () => {
        this.currentObject = this.canvas.getActiveObject();
      },
      "selection:updated": () => {
        this.currentObject = this.canvas.getActiveObject();
      },
      "selection:cleared": () => {
        this.currentObject = null;
      }
    });
    this.canvas = canvas;
  },
  computed: {
    currentObjectType() {
      if (!this.currentObject) return "";
      return this.currentObject.type;
    },
  },
  methods: {
    setAttr(attr, val) {
      this.currentObject.set(attr, val);
      this.canvas.renderAll();
    },
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
    }
  }
};
</script>
