import { Model } from "@vuex-orm/core";
import User from "@/models/User";
import MarkerMem from "@/models/MarkerMem";

export default class Marker extends Model {
  static entity = "markers";

  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      latlng: this.attr(null),
      image: this.attr(null),
      mem_ids: this.attr([]),
      mems: this.hasManyBy(MarkerMem, "mem_ids"),
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
                  Marker.insert({
                    data: {
                      id: data.id,
                      creator: data.creator,
                      latlng: data.latlng,
                      mem_ids: data.mem_ids,
                      image: urlData.data,
                    },
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

  // static delete(id) {
  //   const accessToken = sessionStorage.getItem("access_token");
  //   if (accessToken) {
  //     fetch(
  //       `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers/${id}`,
  //       {
  //         method: "DELETE",
  //         headers: new Headers({
  //           Authorization: accessToken,
  //           "Content-Type": "application/json",
  //         }),
  //       }
  //     )
  //       .then((res) => res.text())
  //       .then(() => {
  //         Marker.deleteAll();
  //         Marker.fetch();
  //       });
  //   }
  // }

  static async uploadMarker(marker, fileType) {
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
          body: JSON.stringify({ fileType }),
        }
      );
      let json = await response.json();

      let form = new FormData();
      Object.keys(json.data.fields).forEach((key) =>
        form.append(key, json.data.fields[key])
      );
      form.append("file", marker.image);

      response = await fetch(json.data.url, { method: "POST", body: form });
      if (!response.ok) return "Failed to upload via presigned POST";
      
      const imageKey = json.data.fields["x-amz-meta-imageKey"]
      marker.image_key = imageKey

      response = await fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers",
        {
          method: "PUT",
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(marker),
        }
      );
      json = await response.json();
      Marker.insert({ data: marker })

      setTimeout(() => {
        Marker.deleteAll();
        Marker.fetch();
      }, 5000);

      return `File uploaded successfully`;
    }
    return "File upload failed";
  }
}
