<template>
  <div id="google-sign-in" />
</template>
<script>
import GoogleUser from "@/models/GoogleUser";
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
    }, 1000);
  },
  methods: {
    onSuccess(googleUser) {
      var profile = googleUser.getBasicProfile();
      const user = {
        email: profile.getEmail(),
        thumbnail: profile.getImageUrl(),
        full_name: profile.getName(),
        given_name: profile.getGivenName(),
        family_name: profile.getFamilyName()
      };
      GoogleUser.insert({ data: user });

      const id_token = googleUser.getAuthResponse().id_token;
      localStorage.setItem("access_token", id_token);

      // fetch data on login
      Marker.fetch()
    },
    onFailure(error) {
      console.log("google sign in error", error);
    }
  }
};
</script>
