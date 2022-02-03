const signinform = document.querySelector( '#signinform' );

signinform.addEventListener( 'click', async ( event ) =>
{
	if ( !event.target.id ) return;
	// event.preventDefault();
	const { id } = event.target;
	switch ( id )
	{
		case 'signin':
			signinform.setAttribute( 'action' , "/api/auth" );
		break;
		case 'signup':
			signinform.setAttribute( 'action' , "/api/users" );
		break;
		case 'reset':
			signinform.setAttribute( 'action' , "/api/reset" );
		break;
		default: break;
	}
} );