// User Model

import { Model } from "@vuex-orm/core";
import User from "@/models/User";
import Mem from "@/models/Mem";

export default class Memage extends Model {
  static entity = "memages";

  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      image: this.attr(null),
      mem_ids: this.attr([]),
      mems: this.hasManyBy(Mem, "mem_ids"),
    };
  }

  static fetch() {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/memages",
        {
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
        }
      )
        .then(response => response.json())
        .then(resp => {
          if (!resp.Items) return
          resp.Items.forEach(data => {
            if (data.image_keys) {
              data.image_keys.forEach(image_key => {
                fetch(
                  "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/download",
                  {
                    method: "POST",
                    headers: new Headers({
                      Authorization: accessToken,
                      "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({ key: image_key }),
                  }
                )
                  .then(response => response.json())
                  .then(urlData =>
                    Memage.insert({
                      data: {
                        id: data.id,
                        creator: data.creator,
                        image: urlData.data,
                      },
                    })
                  );
              })
            }
          })
        });
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
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/memages/${id}`,
        {
          method: "DELETE",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
        }
      )
        .then((res) => res.text())
        .then(() => {
          Memage.deleteAll();
          Memage.fetch();
        });
    }
  }

  static async uploadMemage(image, fileType) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      let response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/upload",
        {
          method: "POST",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ fileType, type: "memage" }),
        }
      );
      let json = await response.json();

      let form = new FormData();
      Object.keys(json.data.fields).forEach((key) =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", image);

      response = await fetch(json.data.url, { method: "POST", body: form });
      if (!response.ok) return "Failed to upload via presigned POST";

      setTimeout(() => {
        Memage.deleteAll();
        Memage.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }
}
