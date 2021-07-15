import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
import User from "@/models/User";
import Mem from "@/models/Mem";

export default class Memage extends Model {
  static entity = "memages";

  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      image_key: this.attr(null),
      image: this.attr(null),
      mem_ids: this.attr([]),
      mems: this.hasManyBy(Mem, "mem_ids"),
    };
  }

  static fetch() {
    Api.call("GET", "memages").then((resp) =>
      resp.Items.forEach((data) => {
        if (data.image_key) {
          Api.call("POST", "download", { key: data.image_key }).then(
            (urlData) => {
              Memage.insert({
                data: { image: urlData.data, ...data },
              });
            }
          );
        }
      })
    );
  }
  
  static update(memage) {
    Api.call("PUT", `memages/${memage.id}`, memage).then(() => {
      Memage.insert({ data: memage });
    });
  }

  // static fetchById(id) {
  //   const accessToken = sessionStorage.getItem("access_token");
  //   if (accessToken) {
  //     fetch(
  //       `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/markers/${id}`,
  //       {
  //         headers: new Headers({b7046b0e-776d-4d33-8b31-2ca9513ee73b
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
  //       `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/memages/${id}`,
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
  //         Memage.deleteAll();
  //         Memage.fetch();
  //       });
  //   }
  // }

  static uploadMemage(file) {
    Api.uploadImage(file).then((imageKey) => {
      if (imageKey) {
        Api.call("PUT", "memages", { image_key: imageKey }).then((memage) => {
          Memage.insert({ data: memage });
        });
        setTimeout(() => {
          Memage.deleteAll();
          Memage.fetch();
        }, 5000);
      }
    });
  }
}
