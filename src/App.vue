<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { fabric } from "fabric"
export default {
  name: "App",
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
          }
        }
      );
    })();
  }
};
</script>
