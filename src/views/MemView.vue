<template>
  <v-row>
    <v-btn fab class="floating-button" @click="openFileDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-file-input
      v-show="false"
      ref="imageUpload"
      accept="image/*"
      hide-input
      prepend-icon=""
      @change="addMemage"
    />
    <v-col cols="12" sm="6" offset-sm="3" class="my-5">
      <v-card v-if="memages.length">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(mem, i) in memages"
              :key="i"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex">
                <v-img
                  :src="mem.image"
                  height="250"
                  contain
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Memage from "@/models/Memage";
export default {
  data() {
    return {
      dialog: false,
    };
  },
  created() {
    Memage.fetch();
  },
  computed: {
    memages() {
      return Memage.all();
    },
  },
  methods: {
    openFileDialog() {
      this.$refs.imageUpload.$refs.input.click();
    },
    addMemage(file) {
      Memage.uploadMemage(file, file.type);
    },
  },
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
