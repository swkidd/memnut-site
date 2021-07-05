// User Model

import { Model } from "@vuex-orm/core";
import User from "@/models/User";

export default class Marker extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = "markers";

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      latlng: this.attr(null),
      images: this.attr([])
    };
  }

  static fetch() {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
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
        .then(resp =>
          resp.Items.forEach(data => {
            if (data.image_keys) {
              let promises = [];
              data.image_keys.forEach(image_key => {
                promises.push(
                  fetch(
                    "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/download",
                    {
                      method: "POST",
                      headers: new Headers({
                        Authorization: accessToken,
                        "Content-Type": "application/json"
                      }),
                      body: JSON.stringify({ key: image_key })
                    }
                  )
                    .then(response => response.json())
                    .then(urlData => urlData.data)
                );
              });
              Promise.all(promises).then(images => {
                Marker.insert({
                  data: {
                    id: data.id,
                    creator: data.creator,
                    latlng: data.latlng,
                    images
                  }
                });
              });
            }
          })
        );
    }
  }

  // static fetchById(id) {
  //   const accessToken = sessionStorage.getItem("access_token");
  //   if (accessToken) {
  //     fetch(
  //       `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers/${id}`,
  //       {
  //         headers: new Headers({
  //           Authorization: accessToken,
  //           "Content-Type": "application/json"
  //         })
  //       }
  //     )
  //       .then(response => response.json())
  //       .then(resp => Marker.insert({ data: resp.Item }));
  //   }
  // }

  static delete(id) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers/${id}`,
        {
          method: "DELETE",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(res => res.text())
        .then(() => {
          Marker.deleteAll();
          Marker.fetch();
        });
    }
  }

  static async uploadMarker(marker, fileType) {
    if (marker.images.length !== 1) return;
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      Marker.insert({ data: marker });
      let response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/upload",
        {
          method: "POST",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ latlng: marker.latlng, fileType, type: "marker" })
        }
      );
      let json = await response.json();

      let form = new FormData();
      Object.keys(json.data.fields).forEach(key =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", marker.images[0]);

      response = await fetch(json.data.url, { method: "POST", body: form });
      if (!response.ok) return "Failed to upload via presigned POST";

      setTimeout(() => {
        Marker.deleteAll();
        Marker.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }

  static async addImageToMarker(marker, image, fileType) {
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
          body: JSON.stringify({ markerid: marker.id, latlng: marker.latlng, fileType, type: "marker" })
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
        Marker.deleteAll();
        Marker.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }
}
