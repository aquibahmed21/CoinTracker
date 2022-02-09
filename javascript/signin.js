const signinform = document.querySelector( '#signinform' );

signinform.addEventListener( 'click', async ( event ) =>
{
	// event.preventDefault();
	if ( !event.target.id ) return;
	const { id } = event.target;
	switch ( id )
	{
		case 'signin':
			signinform.setAttribute( 'route' , "/api/auth" );
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
				alert( "Please enter email and password" );

			const data = { email, password };

			const res = await fetch(route, {
					method: 'POST',
					headers: {
						'Accept': 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
			} )
			const token = await res.json();
			console.log(token);
		break;
		case 'btnsignup': break;
		case 'btnsignreset': break;

		default: break;
	}
} );