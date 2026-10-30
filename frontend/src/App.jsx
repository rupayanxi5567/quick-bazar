import {
    Show,
    SignInButton,
    SignUpButton,
    useAuth,
    UserButton,
} from "@clerk/react";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";

function App() {
    let { isLoaded } = useAuth();

    if (!isLoaded) {
        return <PageLoader />;
    }

    return (
        <Layout>
            <header>
                <Show when="signed-out">
                    <SignInButton mode="modal" />
                    <SignUpButton mode="modal" />
                </Show>
                <Show when="signed-in">
                    <UserButton />
                </Show>
            </header>

            <p className="text-lime-500  font-extrabold text-4xl">
                Helo brooooooooooooo
            </p>
            <button className="btn btn-primary"> click me </button>
        </Layout>
    );
}

export default App;
