//import supabase from '../utils/supabase';


function SignUpForm() {


    const handleSignUpSubmission = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("signing up!!")
        //const { data, error } = await supabase.signUpWithEmail()
    }

    return <>
        <div className="form">
            <h1>Sign Up Form</h1>
            <form onSubmit={handleSignUpSubmission}>
                <input name="firstName" type="text" placeholder="First Name"/>
                <input type="text" placeholder="Last Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    </>
}


export default SignUpForm;