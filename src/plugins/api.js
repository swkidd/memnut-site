const call = (method, endpoint, body) => {
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
        body: body ? JSON.stringify(body) : undefined,
      }
    ).then((response) => response.json());
  }
};

const uploadImage = (file) => {
  return call("POST", "upload", { fileType: file.type }).then((json) => {
    let form = new FormData();
    Object.keys(json.data.fields).forEach((key) =>
      form.append(key, json.data.fields[key])
    );
    form.append("file", file);

    return fetch(json.data.url, { method: "POST", body: form }).then((response) => {
      return new Promise((resolve, err) => {
	if (!response.ok) err("Failed to upload via presigned POST")

	const imageKey = json.data.fields["x-amz-meta-imagekey"];
	resolve(imageKey)
      })
    });
  });
};

export default {
  call,
  uploadImage,
};
