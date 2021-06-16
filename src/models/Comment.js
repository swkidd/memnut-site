// User Model

import { Model } from "@vuex-orm/core";

export default class Comment extends Model {
  static entity = "comments";

  static fields() {
    return {
      id: this.attr(null),
      markerId: this.attr(null),
      creator: this.attr(null),
      links: this.attr(null),
      text: this.attr(null),
    };
  }

  static fetchById(id) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/comments/${id}`,
        {
          headers: new Headers({
            "Authorization": accessToken,
            "Content-Type": "application/json"
          })
        }
      )
        .then(response => response.json())
        .then(resp =>  resp.Items.forEach(data => Comment.insert({ data })));
    }
  }

  static put(data) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch(
        "https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/comments",
        {
          method: "PUT",
          headers: new Headers({
            "Authorization": accessToken,
            "Content-Type": "application/json"
          }),
          body: JSON.stringify(data)
        }
      )
        .then(response => response.json())
        .then(data =>  Comment.insert({ data }));
    }
  }
}
