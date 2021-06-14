<template>
  <div id="google-sign-in" />
</template>
<script>
export default {
  name: "GoogleSignInButton",
  mounted() {
    window.gapi.signin2.render("google-sign-in", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: this.onSuccess,
      onfailure: this.onFailure
    });
  },
  methods: {
    onSuccess(googleUser) {
      console.log("Logged in as: " + googleUser.getBasicProfile().getName());
    },
    onFailure(error) {
      console.log('google sign in error', error);
    }
  }
};
</script>
