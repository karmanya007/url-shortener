import '@babel/polyfill';
import { shortify, deletify, checkAvailability } from './shortify';

const form = document.getElementById('myForm');
const slugUrls = document.querySelectorAll('.slugUrl');
const deleteBtns = document.querySelectorAll('.deleteBtn');
const checkBtn = document.getElementById('check-link-availability');

if (form) {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const url = document.getElementById('url').value;
		const slug = document.getElementById('slug').value;
		const isPrivate =
			document.querySelector('.active').childNodes[1].value === 'private'
				? true
				: false;
		shortify(url, slug, isPrivate);
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

if (checkBtn) {
	checkBtn.addEventListener('click', async () => {
		const slug = document.getElementById('slug').value;
		if (slug) {
			const isAvailable = await checkAvailability(slug);
			const messageBox = document.getElementById('link-availability-status');
			if (isAvailable === 'Slug already exists. Try another one.') {
				messageBox.classList.remove('text-info');
				messageBox.classList.add('text-danger');
			} else {
				messageBox.classList.remove('text-danger');
				messageBox.classList.add('text-info');
			}
			messageBox.innerText = isAvailable;
		}
	});
}
