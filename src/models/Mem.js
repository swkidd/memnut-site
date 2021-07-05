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
            if (data.image_key) {
              fetch(
                "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/download",
                {
                  method: "POST",
                  headers: new Headers({
                    Authorization: accessToken,
                    "Content-Type": "application/json"
                  }),
                  body: JSON.stringify({ key: data.image_key })
                }
              )
                .then(response => response.json())
                .then(urlData => {
                  Mem.insert({
                    data: {
                      id: data.id,
                      marker_id: data.marker_id,
                      creator: data.creator,
                      latlng: data.latlng,
                      image: urlData.data
                    }
                  });
                })
            }})
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
        .then(resp => Mem.insert({ data: resp.Item }));
    }
  }

  static async uploadMem(marker, image) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      let response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/upload",
        {
          method: "POST",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ latlng: marker.latlng, fileType: "image/webp", type: "mem" })
        }
      );
      let json = await response.json();

      let form = new FormData();
      Object.keys(json.data.fields).forEach(key =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", image);

      response = await fetch(json.data.url, { method: "POST", body: form });
      if (!response.ok) return "Failed to upload via presigned POST";

      setTimeout(() => {
        Mem.deleteAll();
        Mem.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
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
      ).then(() => Mem.fetch());
    }
  }
}
