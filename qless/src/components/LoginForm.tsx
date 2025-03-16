import supabase from '../utils/supabase';


function LoginForm() {


    const handleLoginSubmission = async (event: React.FormEvent<HTMLFormElement>)=> {
        event.preventDefault();


        const formData = new FormData(event.currentTarget);
        const email = formData.get("emailLogin") as string;
        const password = formData.get("passwordLogin") as string;

        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (data.user !== null && data.session !== null){
                console.log(`successfully logged in ${data.user.user_metadata.first_name}`);
            }
            else if (error !== null){
                console.log(`Error logging in that user: ${error.message}`);
            }
            else{
                console.log(`An unexpected error occured during the login process.`);
            }
        }
        catch (err){
           console.log("Unable to complete login request... ", err);
        }

    }

    return (
        <div>
            <h1>Login Form</h1>
            <form onSubmit={handleLoginSubmission}>
                <input id='emailLogin' name="emailLogin" type="email" placeholder="Email" />
                <input id='passwordLogin' name="passwordLogin" type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}


export default LoginForm;