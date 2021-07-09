import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
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
    Api.call("GET", "markers").then((resp) =>
      resp.Items.forEach((data) => {
        if (data.image_key) {
          Api.call("POST", "download", { key: data.image_key }).then(
            (urlData) => {
              Marker.insert({
                data: {
                  id: data.id,
                  creator: data.creator,
                  latlng: data.latlng,
                  mem_ids: data.mem_ids,
                  image: urlData.data,
                },
              });
            }
          );
        }
      })
    );
  }

  static uploadMarker(marker, file) {
    Api.uploadImage(file).then((imageKey) => {
      if (imageKey) {
        marker.image_key = imageKey
        Api.call("PUT", "markers", marker).then(() => {
          Marker.insert({ data: marker });
        });
        setTimeout(() => {
          Marker.deleteAll();
          Marker.fetch();
        }, 5000);
      }
    });
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
}
