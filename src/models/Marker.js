// User Model

import { Model } from "@vuex-orm/core";

export default class Marker extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = "markers";

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields() {
    return {
      id: this.attr(null),
      latlng: this.attr(null),
      image: this.attr(null)
    };
  }

  static fetch() {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      console.log(accessToken);
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers",
        {
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(response => response.json())
        .then(resp => resp.Items.forEach(data => Marker.insert({ data })));
    }
  }

  static fetchById(id) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers/${id}`,
        {
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(response => response.json())
        .then(resp => Marker.insert({ data: resp.Item }));
    }
  }

  static put(data) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      let form = new FormData();
      form.append("latlng", data.latlng);
      form.append("image", data.image);

      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers",
        {
          method: "PUT",
          headers: new Headers({
            Authorization: accessToken
          }),
          body: form
        }
      ).then(response => console.log(response));
      // .then(response => response.json())
      // .then(data =>  Marker.insert({ data }));
    }
  }

  static async uploadImage(file) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      let response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/upload",
        {
          headers: new Headers({
            Authorization: accessToken
          })
        }
      );
      let json = await response.json();

      let form = new FormData();
      Object.keys(json.data.fields).forEach(key =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", file);

      response = await fetch(json.data.url, { method: "POST", body: form });
      console.log(response)
      if (!response.ok) return "Failed to upload via presigned POST";

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }
}
