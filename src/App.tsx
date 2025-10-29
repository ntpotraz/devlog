import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import "./App.css";
import Homepage from "./Homepage";

function App() {
  return (
    <header>
      <SignedOut>
        <h1 className="devFont text-orange-500 text-9xl text-center my-8">
          devlog
        </h1>
        <SignInButton>
          <button
            type="button"
            className="flex-1 devFont text-orange-500 text-2xl border border-orange-500 rounded-lg px-8 py-4 hover:bg-orange-500 hover:text-gray-800 transition-all duration-200 ease-in-out"
          >
            login
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Homepage />
      </SignedIn>
    </header>
  );
}

export default App;
