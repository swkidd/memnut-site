import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
import Mem from "@/models/Mem";
import Marker from "@/models/Marker";

export default class MarkerMem extends Model {
  static entity = "markermems";

  static fields() {
    return {
      id: this.attr(null),
      order: this.attr(null),
      marker_id: this.attr(null),
      marker: this.belongsTo(Marker, "marker_id"),
      mem_id: this.attr(null),
      mem: this.belongsTo(Mem, "mem_id"),
      key: this.attr(null),
      scaleX: this.attr(null),
      scaleY: this.attr(null),
      left: this.attr(null),
      top: this.attr(null),
      width: this.attr(null),
    };
  }

  static fetch() {
    Api.call("GET", "markermems").then((resp) =>
      resp.Items.forEach((data) => {
        MarkerMem.insert({
          data,
        });
      })
    );
  }

  static put(markermem) {
    return Api.call("PUT", "markermems", markermem).then((markermemWithID) => {
      MarkerMem.insert({ data: markermemWithID });
      return markermemWithID
    });
  }
}
