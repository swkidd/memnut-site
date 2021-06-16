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
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers",
        {
          headers: new Headers({
            "Authorization": accessToken,
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
            "Authorization": accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(response => response.json())
        .then(data =>  Marker.insert({ data }));
    }
  }

  static put(data) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers",
        {
          method: "PUT",
          headers: new Headers({
            "Authorization": accessToken,
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(data)
        }
      )
        .then(response => response.json())
        .then(data =>  Marker.insert({ data }));
    }
  }
}
