let myHeaders = new Headers();
myHeaders.append(
	"Authorization",
	"Basic QWNlbnRyaXhfSm9yZGFuOl4oOXhEdnBkQnpxZlQ4aiVIOW0zM3B1RQ==",
	"Access-Control-Request-Method",
	"GET",
	"Access-Control-Request-Headers",
	"Content-Type, Authorization"
);

let requestOptions = {
	method: "GET",
	headers: myHeaders,
	redirect: "follow",
};

export const GET_WP_DATA = async () => {
	let data = {};
	let error = {};

	await fetch(
		"https://agencies.co/wp-json/wp/v2/7l6g23-fasfmo-7yafea-fn32wb-ufw33l",
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => (data = result))
		.catch((err) => (error = err));

	return { data, error };
};
