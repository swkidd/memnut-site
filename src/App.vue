<template>
  <v-app>
    <v-app-bar :dense="$vuetify.breakpoint.mobile" max-height="60" height="60" fixed>
      <v-icon class="mx-1">mdi-tooltip-image</v-icon>
      <v-toolbar-title
        @click="$route.path !== 'palace' ? $router.push({ name: 'palace' }) : undefined"
        style="cursor: pointer;"
        >MEMNUT</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <google-sign-in-button />

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn text :to="{ name: 'posts' }">
              Posts
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn text :to="{ name: 'memages' }">
              Memages
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
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
