import {
	setToStorageContact, getFromStorageContacts, toCard,
	addButtonsListener, setToStorageContacts
} from './utils';

export class Contacts{
	static create(contact){
		return fetch('https://js-podcast-app-1944b.firebaseio.com/Contacts.json',{
		method: 'POST',
		body: JSON.stringify(contact),
		headers:{
			'Content-Type': 'application/json'
		}
		})
			.then( response => response.json())
			.then( responce => {
				contact.id = responce.name;
			return contact;
		})
			// .then(setToStorageContact);
			.finally(setToStorageContact);
	}
	static edit(contact, index){
		// return fetch('https://js-podcast-app-1944b.firebaseio.com/Contacts.json',{
		// method: 'POST',
		// body: JSON.stringify(contact),
		// headers:{
		// 	'Content-Type': 'application/json'
		// }
		// })
		// 	.then( response => response.json())
		// 	.then( responce => {
		// 		contact.id = responce.name;
		// 	return contact;
		// })
			// .then(setToStorageContacts);
		const emitateEdit = (index) => new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(index);
			}, 300);
		});
		return emitateEdit(index)
			.finally(() => setToStorageContacts(contact, index));
	}

	static fetch(token){
		if (!token){
			return Promise.resolve(`<p class="error">You are haven't token</p>`);
		}
		return fetch(`https://js-podcast-app-1944b.firebaseio.com/Contacts.json?auth=${token}`)
			.then(responce => responce.json())
			.then(response => {
				if (response && response.error){
					return `<p class="error">${response.error}</p>`;
				}

				return response ? Object.keys(response).map( key =>({
					...response[key],
					id: key
				})) : []
			});
	}

	static renderContacts(){
		const contacts = getFromStorageContacts();
		const list = document.querySelector('#list');
		const html = contacts.length ?
			contacts.map(toCard).join('') :
			` <div class="mui--text-headline">Contacts are not exist...</div>`;

		list.innerHTML = html;
		addButtonsListener();
	}
	static listToHTML(contacts){
		return contacts.length
		? `<ol>${contacts.map( (c, idx) => `<li>${c.text} tel.: ${c.number || 'no number'}</li>`).join('')}
		</ol>`
		: `<p class="info">Контактов пока нет</p>`;
	}
}

