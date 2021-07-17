import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
import User from "@/models/User";
import Marker from "@/models/Marker";

export default class Palace extends Model {
  static entity = "palaces";

  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      title: this.attr(''),
      text: this.attr(''),
      marker_ids: this.attr([]),
      markers: this.hasManyBy(Marker, "marker_ids"),
    };
  }

  static fetch() {
    Api.call("GET", "palaces").then((resp) =>
      resp.Items.forEach((data) => {
        Palace.insert({ data });
      })
    );
  }

  static update(palace) {
    Api.call("PUT", "palaces", palace).then(() => {
      Palace.insert({ data: palace });
    });
  }
}
