<template>
  <v-container fluid v-if="marker">
    <v-dialog v-model="dialog" width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          v-bind="attrs"
          v-on="on"
          :style="floatingButtonStyle"
          class="floating-button"
        >
          <v-icon>
            mdi-comment-outline
          </v-icon>
        </v-btn>
      </template>
      <v-card elevation="3" width="95%">
        <v-card-title>
          <v-textarea v-model="text" outlined />
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn @click="submit" text>POST</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="space-around">
      <v-col style="max-width: 500px;" class="ma-15 d-flex justify-center">
        <v-img class="ma-5" :src="marker.image" />
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-5">
      <v-card
        v-for="(comment, i) in comments"
        :key="i"
        class="text-center"
        style="max-width: 500px;"
        width="100%"
      >
        <v-card-title class="text-caption" v-text="comment.creator" />
        <v-card-text class="text-h6" v-text="comment.text" />
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import Marker from "@/models/Marker";
import Comment from "@/models/Comment";
export default {
  name: "MarkerDetailView",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    if (!this.id) {
      this.id = this.$router.params.id;
    }

    Marker.fetchById(this.id);
    Comment.fetchById(this.id);
  },
  computed: {
    floatingButtonStyle() {
      return {
        right: "10px",
        bottom: this.$vuetify.breakpoint.mobile ? "50px" : "10px"
      };
    },
    marker() {
      return Marker.query()
        .where("id", this.id)
        .first();
    },
    comments() {
      return Comment.query()
        .where("markerId", this.id)
        .get();
    }
  },
  data() {
    return {
      text: "",
      dialog: false
    };
  },
  methods: {
    submit() {
      Comment.put({ markerId: this.id, text: this.text });
      this.text = "";
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
