<template>
  <v-menu v-model="menu" v-bind="$attrs" top :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon v-text="icon" />
      </v-btn>
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
    },
    icon: {
      type: String,
      required: false,
      default: ""
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
    }
  }
};
</script>
