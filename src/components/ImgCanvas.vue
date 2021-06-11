<template>
  <canvas ref="can" v-bind="$attrs"></canvas>
</template>

<script>
import { fabric } from 'fabric';

export default {
  mounted() {
    const ref = this.$refs.can;
    const canvas = new fabric.Canvas(ref);
    const rect = new fabric.Rect({
      fill: 'red',
      width: 20,
      height: 20
    });
    canvas.add(rect);
  }
};
</script>
