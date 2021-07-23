<template>
  <v-row>
    <v-container fluid justify="center" class="ma-5">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" class="my-5">
          <h2 class="ma-5">Posts</h2>
          <v-card v-for="(post, i) in posts" :key="i" width="100%">
            <v-card-title v-text="post.palace.title" />
            <v-card-text>
              {{ post.palace.text }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click.prevent="goToPost(post.id)">go to post</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import Post from "@/models/Post";
export default {
  name: "PostView",
  computed: {
    posts() {
      return Post.query()
        .withAllRecursive()
        .get();
    }
  },
  methods: {
    goToPost(id) {
      const routeData = this.$router.resolve({
        name: "post-detail",
        params: { id }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>
