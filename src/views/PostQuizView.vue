<template>
  <v-row v-if="post">
    <v-col cols="12" sm="6" offset-sm="3">
      <v-row justify="center" class="ma-5" v-if="currentMem">
        <v-col
          v-for="(marker, i) in post.palace.markers"
          :key="i"
          class="d-flex child-flex"
          cols="4"
        >
          <v-img :src="currentMem.image" height="250" contain>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
      <v-card v-if="post.palace.markers.length">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(marker, i) in post.palace.markers"
              :key="i"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex" @click="checkAnswer(marker.id)">
                <v-img
                  :src="marker.image"
                  height="250"
                  contain
                  :class="
                    correct === null
                      ? ['grey', 'lighten-2']
                      : correct
                      ? ['green']
                      : ['red']
                  "
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
import Post from "@/models/Post";
import Palace from "@/models/Palace";
import Marker from "@/models/Marker";
import MarkerMem from "@/models/Marker";
import Mem from "@/models/Marker";
export default {
  name: "PostDetailView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentMarker: null,
      currentMem: null,
      correct: null
    };
  },
  created() {
    Palace.fetch();
    Marker.fetch();
    MarkerMem.fetch();
    Mem.fetch();
  },
  mounted() {
    if (!this.id) {
      this.id = this.$router.params.id;
    }
  },
  computed: {
    post() {
      return Post.query()
        .withAllRecursive(12)
        .where("id", this.id)
        .first();
    }
  },
  watch: {
    post: {
      deep: true,
      handler() {
        if (!this.currentMem) {
          this.randomMem();
        }
      }
    }
  },
  methods: {
    checkAnswer(id) {
      this.correct = this.currentMarker.id === id;
      if (this.correct) {
        setTimeout(() => {
          this.randomMem();
          this.correct = null;
        }, 1000);
      }
    },
    randomMem() {
      if (
        this.post &&
        this.post.palace &&
        this.post.palace.markers &&
        this.post.palace.markers.length
      ) {
        const markersLen = this.post.palace.markers.length;
        this.currentMarker = this.post.palace.markers[
          Math.floor(Math.random() * markersLen)
        ];
        if (
          this.currentMarker &&
          this.currentMarker.mems &&
          this.currentMarker.mems.length
        ) {
          const len = this.currentMarker.mems.length;
          this.currentMem = this.currentMarker.mems[
            Math.floor(Math.random() * len)
          ].mem;
        }
      }
    }
  }
};
</script>
