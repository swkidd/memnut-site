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
      <v-text-field
        v-model="search"
        label="Search..."
        solo
        outlined
        append-icon="mdi-magnify"
        @click:append="filterItems(search)"
        @keyup.enter="filterItems(search)"
      />
      <v-card v-if="memages.length">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(mem, i) in memages"
              :key="i"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex" @click="goToMemage(mem.id)">
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
import Mem from "@/models/Mem";
import Memage from "@/models/Memage";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      validSearch: ""
    };
  },
  created() {
    console.log('hello')
    Mem.fetch()
    Memage.fetch();
  },
  computed: {
    memages() {
      return Memage.query()
        .withAllRecursive()
        .get()
        .filter(memage => {
          const s = this.validSearch.toLowerCase()
          if (s === "") return true
          return memage.mems.some(mem => {
            return mem.front.toLowerCase().includes(s) ||
              mem.back.toLowerCase().includes(s);
          });
        })
    }
  },
  watch: {
    search(val) {
      if (val === "") {
        this.validSearch = "";
      }
    }
  },
  methods: {
    filterItems(search) {
      this.validSearch = search;
    },
    goToMemage(id) {
      const routeData = this.$router.resolve({
        name: "memage-detail",
        params: { id }
      });
      window.open(routeData.href, "_blank");
    },
    openFileDialog() {
      this.$refs.imageUpload.$refs.input.click();
    },
    addMemage(file) {
      Memage.uploadMemage(file);
    }
  }
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
