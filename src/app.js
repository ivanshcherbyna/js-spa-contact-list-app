'use strict';
import { isValid, openAuthModal, addButtonsListener } from './utils';
import { Contacts } from './Contacts';
import './styles.scss';

console.log('%c App is working', 'color:green');

window.addEventListener('load', Contacts.renderContacts);

const form = document.querySelector('#submit-form');
const nameInput = document.querySelector('#contact-name-input');
const contactInput = document.querySelector('#contact-input');
const modalBtn = document.querySelector('#modal-btn');
const submitBtn = document.querySelector('#submit-button');


form.addEventListener('submit', submitHandler);
modalBtn.addEventListener('click', openAuthModal);
nameInput.addEventListener('input', () => submitBtn.disabled = !isValid(nameInput.value));
nameInput.addEventListener('input', () => submitBtn.disabled = !isValid(nameInput.value));



function submitHandler (event) {
	event.preventDefault();
	if (isValid(nameInput.value)) {
		const contact = {
			text: nameInput.value.trim(),
			number: contactInput.value.trim(),
			date: new Date().toJSON()
		};
		submitBtn.disabled = true;
		Contacts.create(contact).then( ()=> {
			nameInput.value = '';
			contactInput.value = '';
			nameInput.className = '';
			contactInput.className = '';
			submitBtn.disabled = false;
		})
			.then(Contacts.renderContacts)
			.then(addButtonsListener());
	}
}


