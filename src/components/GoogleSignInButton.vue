<template>
  <div id="google-sign-in" />
</template>
<script>
import Marker from "@/models/Marker"
export default {
  name: "GoogleSignInButton",
  mounted() {
    // eslint-disable-next-line no-undef
    setTimeout(() => {
      window.gapi.signin2.render("google-sign-in", {
        scope: "profile email",
        theme: "dark",
        onsuccess: this.onSuccess,
        onfailure: this.onFailure
      });
    }, 2000);
  },
  methods: {
    onSuccess(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      sessionStorage.setItem("access_token", id_token);

      // fetch data on login
      Marker.fetch()
    },
    onFailure(error) {
      console.log("google sign in error", error);
    }
  }
};
</script>
