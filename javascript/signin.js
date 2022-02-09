const signinform = document.querySelector( '#signinform' );

window.addEventListener( 'load', async () =>
{
	const token = localStorage.getItem( 'token' );
	if ( token ) {
		const res = await fetch( "/api/auth", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-auth-token": token,
			},
		} );
		const user = await res.json();
		if ( user ) {
			console.log( user.email );
			console.log( "user is logged in" );
		}
		window.location.href = "/dashboard";
	}
} );

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
			const res_data = await res.json();

			if ( res_data.status === "success" )
			{
				localStorage.setItem("token", res_data.token);
				// window.location.href = "/dashboard
			}
		break;
		case 'btnsignup': break;
		case 'btnsignreset': break;

		default: break;
	}
} );