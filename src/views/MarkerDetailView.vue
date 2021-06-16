<template>
  <v-container fluid v-if="marker">
    <v-row justify="space-around">
      <v-col cols="4" class="ma-15 d-flex justify-center">
        <v-img class="ma-5" width="60%" :src="marker.image" />
      </v-col>
      <v-col cols="4" class="ma-15">
        <v-card elevation="3">
          <v-card-text>
            <v-textarea v-model="text" outlined />
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn @click="submit" text>POST</v-btn>
          </v-card-actions>
        </v-card>
        <div v-for="(comment, i) in comments" :key="i">
          {{ comment }}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Marker from "@/models/Marker"
import Comment from "@/models/Comment"
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
      this.id = this.$router.params.id
    }

    Marker.fetchById(this.id)
    Comment.fetchById(this.id)
  },
  computed: {
    marker () {
      return Marker.query().where('id', this.id).first()
    },
    comments() {
      return Comment.query().where('id', this.id).get()
    }
  },
  data() {
    return {
      text: '',
    };
  },
  methods: {
    submit() {
      Comment.put({ markerId: this.id, text: this.text })
    }
  }
};
</script>
