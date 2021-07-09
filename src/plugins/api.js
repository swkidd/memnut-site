export default {
  call(method, endpoint, body) {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      return fetch(
        `https://v5g7mgbgs6.execute-api.ap-northeast-1.amazonaws.com/api/${endpoint}`,
        {
          method,
          headers: new Headers({
            Authorization: accessToken,
            "Content-Type": "application/json",
          }),
          body: body ?? JSON.stringify(body),
        }
      ).then((response) => response.json());
    }
  },
};
