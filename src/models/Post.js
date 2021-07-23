import { Model } from "@vuex-orm/core";
import Api from "@/plugins/api";
import User from "@/models/User";
import Palace from "@/models/Palace";

export default class Post extends Model {
  static entity = "posts";

  static fields() {
    return {
      id: this.attr(null),
      creator_id: this.attr(null),
      creator: this.belongsTo(User, "creator_id"),
      palace_id: this.attr([]),
      palace: this.belongsTo(Palace, "palace_id"),
    };
  }

  static fetch() {
    Api.call("GET", "posts").then((resp) =>
      resp.Items.forEach((data) => {
        Post.insert({ data });
      })
    );
  }

  static update(post) {
    Api.call("PUT", "posts", post).then(() => {
      Post.insert({ data: post });
    });
  }
}
