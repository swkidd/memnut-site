// User Model

import { Model } from "@vuex-orm/core";
import User from "@/models/User";
import Marker from "@/models/Marker";

export default class Mem extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = "mems";

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      marker_id: this.attr(null),
      marker: this.belongsTo(Marker, "marker_id"),
      image: this.attr(null)
    };
  }

  static fetch() {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/mem",
        {
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(response => response.json())
        .then(resp =>
          resp.Items.forEach(data => {
            Mem.insert({ data });
          })
        );
    }
  }

  static fetchById(id) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/mem/${id}`,
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
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/mem",
        {
          method: "PUT",
          headers: new Headers({
            Authorization: accessToken
          }),
          body: JSON.stringify(data)
        }
      ).then(() => {});
    }
  }
}
