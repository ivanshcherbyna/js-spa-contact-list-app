export function getAuthForm () {
	return `
		<form class="mui-form" id="auth-form">
                <div class="mui-textfield mui-textfield--float-label">
                    <input type="email" id="email" required minlength="4" maxlength="150"/>
                    <label for="email">email</label>
				</div>
                <div class="mui-textfield mui-textfield--float-label">
                    <input type="password" id="password" required minlength="8" maxlength="100"/>
                    <label for="password">password</label>
                </div>
                <button
                    id="submit-auth-button"
                    type="submit"
                    class="mui-btn mui-btn--raised mui-btn--primary"
                >
                    LogIn
                </button>
            </form>
	`;
}

export function registrationWithEmailAndPassword (email, password) {
	const API_KEY = 'AIzaSyBs8IKoT-c8ZOaIyFq0MLmrUcht3lSEwwo';
	return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,{
		method: 'POST',
		body: JSON.stringify({email, password, returnSecureToken: true}),
		headers:{
			'Content-Type': 'application/json'
		}
	})
		.then( responce => responce.json())
		.then( data => console.log(data))
		.then( data => data.idToken);
}

export function authWithEmailAndPassword (email, password) {
	const API_KEY = 'AIzaSyBs8IKoT-c8ZOaIyFq0MLmrUcht3lSEwwo';
	return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,{
		method: 'POST',
		body: JSON.stringify({email, password, returnSecureToken: true}),
		headers:{
			'Content-Type': 'application/json'
		}
	})
		.then( responce => responce.json())
		.then( data => data.idToken);
}
