<template>
  <v-row v-if="post">
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
          fab
          class="floating-button"
          style="bottom: 50px; right: 25px;"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card class="pa-5" max-width="500">
        <v-card-text>
          <!-- <v-text-field v-model="title" label="Palace title" outlined />
          <v-textarea v-model="text" label="Palace description" outlined /> -->
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="goToQuiz(post.id)">Start Quiz</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container fluid justify="center" class="ma-5">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" class="my-5">
          <v-card
            v-for="(marker, i) in post.palace.markers"
            :key="i"
            width="100%"
          >
            <v-card-title v-text="marker.title" />
            <v-card-text>
              <img-canvas :url="marker.image" :mems="marker.mems" />
              {{ marker.text }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import Post from "@/models/Post";
export default {
  name: "PostDetailView",
  components: {
    ImgCanvas: () => import("@/components/ImgCanvas")
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  mounted() {
    if (!this.id) {
      this.id = this.$router.params.id;
    }
  },
  computed: {
    post() {
      return Post.query()
        .withAllRecursive()
        .where("id", this.id)
        .first();
    }
  },
  methods: {
    goToQuiz(id) {
      const routeData = this.$router.resolve({
        name: "post-quiz",
        params: { id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  z-index: 50;
}
</style>
