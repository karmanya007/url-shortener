import '@babel/polyfill';
import { shortify, deletify } from './shortify';

const form = document.getElementById('myForm');
const slugUrls = document.querySelectorAll('.slugUrl');
const deleteBtns = document.querySelectorAll('.deleteBtn');

if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const url = document.getElementById('url').value;
		const slug = document.getElementById('slug').value;
		shortify(url, slug);
	});
}

if (slugUrls) {
	slugUrls.forEach((slugUrl) => {
		slugUrl.addEventListener('click', () => {
			window.setTimeout(() => {
				location.assign('/');
			}, 500);
		});
	});
}

if (deleteBtns) {
	deleteBtns.forEach((deleteBtn) => {
		deleteBtn.addEventListener('click', (e) => {
			deletify(
				e.target.parentElement.parentElement.parentElement.parentElement.dataset
					.id
			);
		});
	});
}
