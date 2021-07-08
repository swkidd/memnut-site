import { Model } from "@vuex-orm/core";
import User from "@/models/User";
import Memage from "@/models/Memage";

export default class Mem extends Model {
  static entity = "mems";

  static fields() {
    return {
      id: this.attr(null),
      order: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      memage_id: this.attr(null),
      memage: this.belongsTo(Memage, "memage_id"),
      image: this.attr(null),

      front: this.attr(null),
      back: this.attr(null),
      polygon: this.attr(null),
      width: this.attr(null),
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
            "Content-Type": "application/json",
          }),
        }
      )
        .then((response) => response.json())
        .then((resp) =>
          resp.Items.forEach((data) => {
            if (data.image_key) {
              fetch(
                "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/download",
                {
                  method: "POST",
                  headers: new Headers({
                    Authorization: accessToken,
                    "Content-Type": "application/json",
                  }),
                  body: JSON.stringify({ key: data.image_key }),
                }
              )
                .then((response) => response.json())
                .then((urlData) => {
                  Mem.insert({
                    data: {
                      id: data.id,
                      creator: data.creator,
                      order: data.order,
                      front: data.front,
                      back: data.back,
                      width: data.width,
                      polygon: data.polygon,
                      latlng: data.latlng,
                      image: urlData.data,
                    },
                  });
                });
            }
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
            "Content-Type": "application/json",
          }),
        }
      )
        .then((response) => response.json())
        .then((resp) => Mem.insert({ data: resp.Item }));
    }
  }

  static async uploadMem(mem, image) {
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
          body: JSON.stringify({ fileType: "image/webp" }),
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
      
      const imageKey = json.data.fields["x-amz-meta-imageKey"]
      mem.image_key = imageKey

      response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/mems",
        {
          method: "PUT",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(mem),
        }
      );
      json = await response.json();
      Mem.insert({ data: mem})

      setTimeout(() => {
        Mem.deleteAll();
        Mem.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }
}
