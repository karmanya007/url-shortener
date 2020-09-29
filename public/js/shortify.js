import axios from 'axios';

export const shortify = async (url, slug) => {
	try {
		const post = await axios({
			method: 'post',
			url: `/url`,
			data: {
				url: url,
				slug: slug,
			},
		});
		if (post.data.status === 'success') {
			alert('Short url created successfully!!');
			window.setTimeout(() => {
				location.assign('/');
			});
		}
	} catch (err) {
		if (err.response.data.message.startsWith('E11000'))
			alert('ERROR!! SLUG ALREADY IN USE');
		else {
			alert('Oops, something went wrong');
		}
	}
};

export const deletify = async (id) => {
	try {
		const res = await axios({
			method: 'DELETE',
			url: `/${id}`,
		});
		if (res.status === 204) {
			alert('Short url deleted successfully!!');
			window.setTimeout(() => {
				location.assign('/');
			});
		}
	} catch (err) {
		alert('Something went wrong');
	}
};
