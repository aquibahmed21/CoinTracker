const signinform = document.querySelector( '#signinform' );

window.addEventListener( 'load', async () =>
{
	const token = localStorage.getItem( 'token' );
	if ( token ) {
		let res_data = null;
		res_data = await fetch( "/api/auth",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": token,
				},
			} );
		res_data = await res_data.json();
		if ( res_data && res_data.status === "success" )
			window.location.href = "/dashboard";
	}
} );

signinform.addEventListener( 'click', async ( event ) =>
{
	// event.preventDefault();
	if ( !event.target.id ) return;
	const { id } = event.target;
	switch ( id ) {
		case 'signin':
			signinform.setAttribute( 'route', "/api/auth" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignin" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignin" );
			break;
		case 'signup':
			signinform.setAttribute( 'route', "/api/users" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignup" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignup" );
			break;
		case 'reset':
			signinform.setAttribute( 'route', "/api/reset" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignreset" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignreset" );
			break;
		case 'btnsignin':

			const email = signinform.querySelector( "#email" ).value,
				password = signinform.querySelector( "#pass" ).value,
				route = signinform.getAttribute( 'route' );


			if ( !email.length || !password.length )
				return alert( "Please enter email and password" );

			const data = { email, password };
			let res = null, res_data = null;
			try {
				res = await fetch( route, {
					method: 'POST',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify( data )
				} );
				res_data = await res.json();
			} catch ( e ) { }

			if ( res_data && res_data.status === "success" ) {
				localStorage.setItem( "token", res_data.token );
				window.location.href = "/dashboard";
			}
			else if ( res_data && res_data.status == "invalid" ) {
				alert( res_data.msg );
			}
			break;
		case 'btnsignup': break;
		case 'btnsignreset': break;

		default: break;
	}
} );