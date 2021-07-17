<template>
  <div id="google-sign-in" v-bind="$attrs" />
</template>
<script>
import Palace from "@/models/Palace";
import Marker from "@/models/Marker";
import MarkerMem from "@/models/MarkerMem";
import Mem from "@/models/Mem";
export default {
  name: "GoogleSignInButton",
  data () {
    return {
      timeout: null,
    }
  },
  mounted() {
    if (!window.gapi) {
      // eslint-disable-next-line no-undef
      this.timeout = setInterval(() => {
        if (window.gapi) {
          this.render()
          clearInterval(this.timeout)
          this.timeout = null
        }
      }, 200);
    } else {
      this.render()
    }
  },
  methods: {
    render () {
      window.gapi.signin2.render("google-sign-in", {
        scope: "profile email",
        onsuccess: this.onSuccess,
        onfailure: this.onFailure,
      });
    },
    onSuccess(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      sessionStorage.setItem("access_token", id_token);

      // fetch data on login
      Palace.deleteAll();
      Palace.fetch();
      Mem.deleteAll();
      Mem.fetch();
      Marker.deleteAll();
      Marker.fetch();
      MarkerMem.deleteAll();
      MarkerMem.fetch();
    },
    onFailure(error) {
      console.log("google sign in error", error);
    },
  },
};
</script>
