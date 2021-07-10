import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
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
    Api.call("GET", "mems").then((resp) =>
      resp.Items.forEach((data) => {
        if (data.image_key) {
          Api.call("POST", "download", { key: data.image_key }).then(
            (urlData) => {
              Mem.insert({
                data: { image: urlData.data, ...data },
              });
            }
          );
        }
      })
    );
  }

  static fetchById(id) {
    Api.call("GET", `mems/${id}`).then((resp) => {
      if (resp.Item) {
        Mem.insert({ data: resp.Item });
      }
    });
  }

  static uploadMem(mem, file) {
    Api.uploadImage(file).then((imageKey) => {
      if (imageKey) {
        mem.image_key = imageKey;
        Api.call("PUT", "mems", mem).then(() => {
          Mem.insert({ data: mem });
        });
        setTimeout(() => {
          Mem.deleteAll();
          Mem.fetch();
        }, 5000);
      }
    });
  }

  static put(mem) {
    Api.call("PUT", "mems", mem).then((resp) => {
      Mem.insert({ data: resp });
    });
  }
}
