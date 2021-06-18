<template>
  <v-row>
    <v-toolbar width="100%">
      <v-btn icon @click="addText">
        <v-icon>mdi-message-text-outline</v-icon>
      </v-btn>

      <v-file-input
        accept="image/*"
        hide-input
        prepend-icon="mdi-image-outline"
        style="max-width: 24px;"
        @change="addImage"
      />

      <v-btn icon @click="clear">
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
      <v-spacer />

      <color-picker
        v-if="currentObjectType === 'textbox'"
        :color="color.background"
        icon="mdi-format-color-fill"
        @change="setAttr('backgroundColor', $event)"
      />
      <color-picker
        v-if="currentObjectType === 'textbox'"
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
    <v-row justify="center" class="my-5 fill-height">
      <canvas
        ref="can"
        :height="getHeight"
        :width="getWidth"
        style="border: 1px solid black;"
      ></canvas>
    </v-row>
  </v-row>
</template>

<script>
import { fabric } from "fabric";
import ColorPicker from "./ColorPicker.vue";

export default {
  components: { ColorPicker },
  props: {
    imageTrigger: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      canvas: null,
      currentObject: null,
      canvasWidth: 0,
      canvasHeight: 0,
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
      width: this.canvasWidth,
      height: this.canvasHeight,
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
    getWidth() {
      if (this.$vuetify.breakpoint.mobile) {
        return window.innerWidth * 0.7;
      } else {
        return 500;
      }
    },
    getHeight() {
      if (this.$vuetify.breakpoint.mobile) {
        return window.innerHeight * 0.5
      } else {
        return 500;
      }
    },
    currentObjectType() {
      if (!this.currentObject) return "";
      return this.currentObject.type;
    }
  },
  watch: {
    imageTrigger(val) {
      if (val) {
        this.$emit("change", this.canvas.toDataURL({
          format: 'png',
        }));
      }
    }
  },
  methods: {
    setAttr(attr, val) {
      this.currentObject.set(attr, val);
      this.canvas.renderAll();
    },
    addText() {
      var textbox = new fabric.Textbox("Text goes here...", {
        textAlign: "center",
        width: 200,
        fontSize: 24 
      });
      this.canvas.add(textbox);
    },
    addImage(file) {
      fabric.Image.fromURL(URL.createObjectURL(file), img => {
        img.scaleToWidth(this.getWidth);
        this.canvas.add(img);
      });
    },
    clear() {
      this.canvas.clear();
    },
  }
};
</script>
