<template>
  <v-menu
    v-model="menu"
    v-bind="$attrs"
    top
    nudge-bottom="105"
    nudge-left="16"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <div :style="swatchStyle" v-on="on" />
    </template>
    <v-card>
      <v-card-text class="pa-0">
        <v-color-picker v-model="currColor" flat />
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<script>
export default {
  name: "ColorPicker",
  model: {
    prop: "color",
    event: "change"
  },
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      menu: false
    };
  },
  computed: {
    currColor: {
      get() {
        return this.color;
      },
      set(val) {
        this.$emit("change", val);
      }
    },
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        border: "1px solid black",
        transition: "border-radius 200ms ease-in-out"
      };
    }
  }
};
</script>
