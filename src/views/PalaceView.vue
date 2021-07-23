<template>
  <v-row>
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
          <v-text-field v-model="title" label="Palace title" outlined />
          <v-textarea v-model="text" label="Palace description" outlined />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="addPalace">Add Palace</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container fluid justify="center" class="ma-5">
      <v-row>
        <v-col cols="12" sm="6" offset-sm="3" class="my-5">
          <h2 class="ma-5">Palaces</h2>
          <v-card
            v-for="(palace, i) in palaces"
            :key="i"
            width="100%"
          >
            <v-card-title v-text="palace.title" />
            <v-card-text>
              {{ palace.text }}
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click.prevent="goToPalace(palace.id)">go to palace</v-btn>
              <v-btn @click.prevent="makePost(palace.id)">publish</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-row>
</template>

<script>
import Palace from "@/models/Palace";
import Post from "@/models/Post";
export default {
  name: "PalaceView",
  data() {
    return {
      dialog: false,
      title: "",
      text: "",
    };
  },
  computed: {
    palaces() {
      return Palace.all();
    },
  },
  methods: {
    goToPalace(id) {
      const routeData = this.$router.resolve({
        name: "map",
        params: { id }
      });
      window.open(routeData.href, "_blank");
    },
    addPalace() {
      const palace = {
        title: this.title,
        text: this.text,
      };
      Palace.update(palace);
    },
    makePost(id) {
      const post = {
        palace_id: id,
      }
      Post.update(post)
    }
  },
};
</script>

<style scoped>
.floating-button {
  position: fixed;
  z-index: 50;
}
</style>
