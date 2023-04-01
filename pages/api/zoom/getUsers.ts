export default async function handler(req, res) {
	const response = await fetch('https://api.zoom.us/v2/users', {
		headers: {
			Authorization: `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
		},
	});

	const data = await response.json();
	res.status(200).json(data.users);
}