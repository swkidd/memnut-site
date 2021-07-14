<template>
  <v-app>
    <v-app-bar :dense="$vuetify.breakpoint.mobile" max-height="60" fixed>
      <v-icon class="mx-1">mdi-tooltip-image</v-icon>
      <v-toolbar-title
        @click="$router.push({ name: 'map' })"
        style="cursor: pointer;"
        >MEMNUT</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-btn text to="memages">
        Memages
      </v-btn>

      <google-sign-in-button class="mx-5" />

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main style="margin-top: 60px; max-height: calc(100vh - 60px);">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { fabric } from "fabric";
export default {
  name: "App",
  components: {
    GoogleSignInButton: () => import("@/components/GoogleSignInButton"),
  },
  data: () => ({}),
  created() {
    (function() {
      var addListener = fabric.util.addListener,
        removeListener = fabric.util.removeListener,
        addEventOptions = { passive: false };

      fabric.util.object.extend(
        fabric.Canvas.prototype,
        /** @lends fabric.Canvas.prototype */ {
          _onTouchStart: function(e) {
            (!this.allowTouchScrolling || this.getActiveObject()) &&
              e.preventDefault &&
              e.preventDefault();

            if (this.mainTouchId === null) {
              this.mainTouchId = this.getPointerId(e);
            }
            this.__onMouseDown(e);
            this._resetTransformEventData();
            var canvasElement = this.upperCanvasEl,
              eventTypePrefix = this._getEventPrefix();
            addListener(
              fabric.document,
              "touchend",
              this._onTouchEnd,
              addEventOptions
            );
            addListener(
              fabric.document,
              "touchmove",
              this._onMouseMove,
              addEventOptions
            );
            // Unbind mousedown to prevent double triggers from touch devices
            removeListener(
              canvasElement,
              eventTypePrefix + "down",
              this._onMouseDown
            );
          },
        }
      );
    })();
  },
};
</script>
