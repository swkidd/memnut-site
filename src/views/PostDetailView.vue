<template>
  <v-row v-if="post">
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
      required: true,
    }
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
    },
  },
};
</script>
