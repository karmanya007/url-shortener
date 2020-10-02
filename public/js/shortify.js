import axios from 'axios';

export const shortify = async (url, slug, isPrivate) => {
	try {
		const post = await axios({
			method: 'post',
			url: `/url`,
			data: {
				url: url,
				slug: slug,
				isPrivate: isPrivate,
			},
		});
		if (post.data.status === 'success') {
			alert('Short url created successfully!!');
			window.setTimeout(() => {
				location.assign('/');
			});
		}
	} catch (err) {
		if (err.response.data.message.startsWith('E11000')) {
			alert('ERROR!! SLUG ALREADY IN USE');
		} else {
			alert('Oops, something went wrong');
		}
	}
};

export const deletify = async (id) => {
	try {
		const res = await axios({
			method: 'DELETE',
			url: `/url/${id}`,
		});
		if (res.status === 204) {
			alert('Short url deleted successfully!!');
			window.setTimeout(() => {
				location.assign('/');
			}, 30);
		}
	} catch (err) {
		alert('Something went wrong');
		console.log(err);
	}
};

export const checkAvailability = async (slug) => {
	try {
		const res = await axios({
			method: 'GET',
			url: `/url/checkSlug/${slug}`,
		});
		return res.data.message;
	} catch (err) {
		alert('Something went wrong');
	}
};
