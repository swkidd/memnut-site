<template>
  <div id="google-sign-in" v-bind="$attrs" />
</template>
<script>
import Marker from "@/models/Marker";
import Mem from "@/models/Mem";
export default {
  name: "GoogleSignInButton",
  mounted() {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      window.gapi.signin2.render("google-sign-in", {
        scope: "profile email",
        onsuccess: this.onSuccess,
        onfailure: this.onFailure,
      });
    }, 2000);
  },
  methods: {
    onSuccess(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      sessionStorage.setItem("access_token", id_token);

      // fetch data on login
      Mem.deleteAll();
      Mem.fetch();
      Marker.deleteAll();
      Marker.fetch();
    },
    onFailure(error) {
      console.log("google sign in error", error);
    },
  },
};
</script>
