import { authWithEmailAndPassword, getAuthForm } from './auth'
import { Contacts } from './Contacts';

export function isValid (value) {
	return value.length >= 3;
}
const contactsFromStorage = JSON.parse(localStorage.getItem('contacts'));

export function addButtonsListener () {
	const editButton = document.querySelectorAll('.edit-button');
	const removeButton = document.querySelectorAll('.remove-button');

	editButton.forEach( (item, idx) => editButton[idx].addEventListener("click",() => editContact(idx)) );
	removeButton.forEach( (item, idx) => removeButton[idx].addEventListener("click",() => removeContact(idx)) );
}

export function setToStorageContact (contact) {
	const allContacts = getFromStorageContacts();
	console.log(allContacts);
	localStorage.setItem('contacts',JSON.stringify([contact, ...allContacts]));
}

export function setToStorageContacts (contact, index) {
	const allContacts = getFromStorageContacts();
	const { text, number, date } = contact;
	allContacts[index] = { ...allContacts[index], text, number, date }
	localStorage.setItem('contacts',JSON.stringify(allContacts));
}

export function getFromStorageContacts () {
	return JSON.parse(localStorage.getItem('contacts') || '[]');
}
export function editContact (index){
	const domList = document.querySelector('#list');
	const item = document.querySelector(`#list-item-${index}`);
	const itemData = contactsFromStorage[index];
	domList.querySelector(`#list-item-${index}`).innerHTML = toCard(itemData, index, {editMode: true});

	document.querySelector(`#save-button-${index}`).addEventListener("click",() => editRequest(index));
}

export function removeContact (index) {
	const newContacts = contactsFromStorage.filter( (item, indx) => indx !== index);
	localStorage.setItem('contacts',JSON.stringify(newContacts));
	Contacts.renderContacts();
}

function editRequest (idx) {
	const currentItem = document.querySelector(`#list-item-${idx}`);
	const nameInput = currentItem.querySelector('.input-name');
	const contactInput = currentItem.querySelector('.input-contact');

	const contactData = {
		text: nameInput.value.trim(),
		number: contactInput.value.trim(),
		date: new Date().toJSON()
	};

	Contacts.edit(contactData, idx).then( ()=> {
		// saveBtn.disabled = true;
	})
	.then(Contacts.renderContacts)
	.then(addButtonsListener());
}

const renderSaveButton = (idx) => (
	`<button class="mui-btn mui-btn--raised mui-btn--primary save-button" index=${idx} id=save-button-${idx}>
		Save
	</button>`
);

const renderItemButtons = (idx) => (
		`<button
			class="mui-btn mui-btn--raised mui-btn--primary edit-button"
			>
			Edit
		</button>
		<button
			class="mui-btn mui-btn--raised mui-btn--danger remove-button"
			>
			Remove
		</button>`
);

export function toCard (contact, index, {editMode}) {
	if (contact) {
		const { date, text, number: numb } = contact;
		if (editMode){
			return `<div class="mui--text-black-54 list-item editable-item flexable" id="list-item-${index}"> 
						<div class="mui-textfield">
							<input type="text" placeholder="contact name" title="contact name" 
							class="editable-input input-name" required minlength="1" value="${text}" /> 
						</div>
						<div class="mui-textfield">
							<input type="text" placeholder="contact number" title="contact number" 
							class="editable-input input-contact" value="${numb || ''}" /> ${renderSaveButton(index).toString()}
						</div>
				   </div>`;
		}
		const { number = '(no number)' } = contact;
		return `<div class="mui--text-black-54 list-item" id="list-item-${index}"> 
			<label class="date-label">${new Date(date).toLocaleDateString()} -
			${new Date(date).toLocaleTimeString()} </label><br/>
            <label class="contact-text">${text} tel.${number}</label> ${renderItemButtons(index)}</div> 
            </div>`;
	}
	return null;
}

function createModal (title, content) {
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.innerHTML = `
	<h1>${title}</h1>
	<div class="modal-content">${content}</div>
	`;
	mui.overlay('on', modal);
}

export function openAuthModal () {
	createModal('Authorization', getAuthForm());
	document
		.getElementById('auth-form')
		.addEventListener('submit', authFormHandler, { once:true })
}

function authFormHandler (event) {
	event.preventDefault();

	const btn = event.target.querySelector('button');
	const email = event.target.querySelector('#email').value;
	const password = event.target.querySelector('#password').value;
	authWithEmailAndPassword(email, password)
		.then(Contacts.fetch)
		.then(renderModalAfterAuth)
		.then(() => btn.disabled = true)
}

function renderModalAfterAuth (content) {
	if (typeof content === 'string'){
		createModal('Error', content);
	}
	else {
		createModal('Список вопросов', Contacts.listToHTML(content));
	}
}
