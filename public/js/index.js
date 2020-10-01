import '@babel/polyfill';
import { shortify, deletify, checkAvailability } from './shortify';

const form = document.getElementById('myForm');
const slugUrls = document.querySelectorAll('.slugUrl');
const deleteBtns = document.querySelectorAll('.deleteBtn');
const checkBtn = document.getElementById('check-link-availability');
const privacyBtn = document.querySelector('.active');

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

if (checkBtn) {
	checkBtn.addEventListener('click', async () => {
		const slug = document.getElementById('slug').value;
		const isAvailable = await checkAvailability(slug);
		const messageBox = document.getElementById('link-availability-status');
		messageBox.innerText = isAvailable;
	});
}

if (privacyBtn) {
	console.log(privacyBtn.childNodes[1].value);
}
