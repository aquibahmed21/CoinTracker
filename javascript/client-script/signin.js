// Enums
const Routes = {
	Signin: "/api/auth",
	SignUp: "/api/users",
	Reset: "/api/reset"
};

const Method = {
	GET: "GET",
	POST: "POST",
};

// Auth Class
class Auth
{
	static async VerifyToken ()
	{
		const token = Store.GetStoredToken();
		if ( token ) {
			try {
				const headers = {
					"Accept": "application/json, text/plain, */*",
					"Content-Type": "application/json",
					"x-auth-token": token,
				};
				return await UtilsFetch( Routes.Signin, Method.GET, headers );
			} catch ( err ) { return null; }
		}
	}
}

// Store Class
class Store
{
	// Get the auth data
	static GetStoredToken ()
	{
		return localStorage.getItem( "token" ) ?
			localStorage.getItem( "token" ) : null;
	}

	// Set the auth data
	static SetTokenData ( data )
	{
		if ( typeof data === "object" )
			data = JSON.stringify( data );

		localStorage.setItem( "token", data );
	}
}

// UI Class
class UI
{
	static headers = {
		"Accept": "application/json, text/plain, */*",
		"Content-Type": "application/json"
	};

	// Navigate to homepage
	static async NavigateToHome ()
	{
		const auth = await Auth.VerifyToken();
		if ( auth && auth.status === "success" && auth.user) {
			window.location.href = "/dashboard";
		}
	}

	// Verify and navigate to dashboard
	static async VerifyLogin ( data )
	{
		const loginDetails = await UtilsFetch( Routes.Signin, Method.POST, UI.headers, JSON.stringify( data ) );
		if ( loginDetails && loginDetails.status === "success" ) {
			Store.SetTokenData( loginDetails.token );
			await UI.NavigateToHome();
		}
		else
			alert( loginDetails.msg );
	}

	// Register a new user
	static async RegisterUser ( data )
	{
		const registerUser = await UtilsFetch( Routes.SignUp, Method.POST, UI.headers, JSON.stringify( data ) );
		if ( registerUser && registerUser.status === "success" ) {
			Store.SetTokenData( registerUser.token );
			await UI.NavigateToHome();
		}
	}
}


window.addEventListener( "DOMContentLoaded", UI.NavigateToHome );
const signinform = document.querySelector( "#signinform" );

// function SetIntialState ()
// {
// 	const isSetData = localStorage.getItem( "data" );
// 	if ( !isSetData ) { 
// 		localStorage.setItem( "data", "true" );
// 		localStorage.setItem("API_KEY" , "M8PSxBKaSyKZuaW5qykQ9oXqVKPm7rglHHCAvGsrHHPiAtILMKQJ1Pp754OxDXqw");
// 		localStorage.setItem("SECRET_KEY" , "5NWh4mrcBTgmvUXZtjUPtsHOxP41q1RtzggauUfX");
// 		localStorage.setItem("BASE_URL" , "https://api.wazirx.com");
// 		localStorage.setItem("PORT" , "3000");
// 		localStorage.setItem("DB_Name" , "DevConnector");
// 		localStorage.setItem("DB_UserName" , "aquib007");
// 		localStorage.setItem("DB_Password" , "UAuoqco7g4Mywq3P");
// 		localStorage.setItem("DB_Connection_String" , "mongodb+srv://aquib007:UAuoqco7g4Mywq3P@devconnector.sucyl.mongodb.net/DevConnector?retryWrites=true&w=majority");
// 		localStorage.setItem("JWT_SECRET" , "5050maskachaska");
// 		localStorage.setItem("JWT_AUTH_EXPIRES" , 360000);
// 	}
// }

signinform.addEventListener( "click", async ( event ) =>
{
	// event.preventDefault();
	if ( !event.target.id ) return;
	const { id } = event.target;
	switch ( id ) {
		case "signin":
			// signinform.setAttribute( "route", "/api/auth" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignin" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignin" );
			break;
		case "signup":
			// signinform.setAttribute( "route", "/api/users" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignup" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignup" );
			break;
		case "reset":
			// signinform.setAttribute( "route", "/api/reset" );
			signinform.getElementsByTagName( "button" )[ 0 ].setAttribute( "id", "btnsignreset" );
			signinform.getElementsByTagName( "button" )[ 0 ].getElementsByTagName( "span" )[ 0 ].setAttribute( "id", "btnsignreset" );
			break;
		case "btnsignin":
			{
				const email = signinform.querySelector( "#email" ).value,
				password = signinform.querySelector( "#pass" ).value;

				if ( !email.length || !password.length )
					return alert( "Please enter email and password" );

				const data = { email, password };
				await UI.VerifyLogin( data );
			}
			break;
		case "btnsignup":
			{
				const email = signinform.querySelector( "#email" ).value,
					password = signinform.querySelector( "#pass" ).value,
					repassword = signinform.querySelector( "#repass" ).value;

				if ( !email.length || !password.length || !repassword.length )
					return alert( "Please enter all fields" );

				if ( password !== repassword )
					return alert( "Passwords do not match" );

				const data = { email, password };
				await UI.RegisterUser( data );
			}
			break;
		case "btnsignreset": break;

		default: break;
	}
} );

async function UtilsFetch ( url, method, headers, body )
{
	try {
		const	res = await fetch( url, {
			method,
			headers,
			body
		} );
		return await res.json();
	} catch ( e ) {
		return null;
	}
}