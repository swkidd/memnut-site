import { Model } from "@vuex-orm/core";
import Mem from "@/models/Mem";

export default class CommentMem extends Model {
  static entity = "commentmems";

  static fields() {
    return {
      id: this.attr(null),
      mem_id: this.attr(null),
      mem: this.belongsTo(Mem, 'mem_id'),
      scaleX: this.attr(null),
      scaleY: this.attr(null),
      left: this.attr(null),
      top: this.attr(null),
    };
  }
}
