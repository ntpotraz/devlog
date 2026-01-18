import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Route, Routes } from "react-router-dom";
import Devlog from "./Devlog";
import EntryView from "./EntryView";
import Homepage from "./Homepage";

function App() {
  return (
    <Routes>
      <Route path="/entry/:id" element={<EntryView />} />
      <Route
        path="*"
        element={
          <div className="relative min-h-screen overflow-hidden bg-[#050607] text-[#f6eadc]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,138,64,0.16),transparent_60%)] opacity-75" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(17,13,11,0.92),transparent_78%)]" />
              <div className="absolute inset-0 mix-blend-screen opacity-45 bg-[linear-gradient(118deg,rgba(255,122,24,0.1),transparent_66%)]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,122,24,0.05)_0px,rgba(255,122,24,0.05)_1px,transparent_1px,transparent_5px)] opacity-25" />
            </div>
            <header className="relative z-10 flex justify-center px-4 py-6 sm:px-6 lg:px-8">
              <div className="w-full max-w-5xl space-y-12">
                <SignedOut>
                  <div className="relative overflow-hidden rounded-[28px] border border-orange-400/35 bg-[#0c0d10]/95 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,124,45,0.12),transparent_60%)]" />
                      <div className="absolute inset-x-8 top-0 h-[70px] bg-[radial-gradient(circle_at_top,rgba(255,124,45,0.18),transparent_70%)]" />
                      <div className="absolute inset-x-4 top-0 h-[3px] bg-linear-to-r from-transparent via-orange-400/90 to-transparent" />
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,122,24,0.07)_0px,rgba(255,122,24,0.07)_1px,transparent_1px,transparent_6px)] opacity-20" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6 px-5 py-7 sm:px-7">
                      <div className="flex items-center justify-between gap-8">
                        <Devlog className="justify-start" />
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(255,124,45,0.8)]" />
                          <span className="devFont text-[10px] uppercase tracking-[0.45em] text-orange-200/80">
                            terminal ready
                          </span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <p className="max-w-xl text-balance font-mono text-sm leading-relaxed text-orange-100/80">
                          Welcome to devlog
                        </p>
                        <SignInButton mode="modal">
                          <button
                            type="button"
                            className="devFont inline-flex items-center gap-4 self-start rounded-xl border border-orange-400/60 bg-orange-400/10 px-10 py-4 text-sm uppercase tracking-[0.4em] text-orange-200 transition hover:bg-orange-400/20 hover:text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                          >
                            login
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-400" />
                          </button>
                        </SignInButton>
                      </div>
                    </div>
                  </div>
                </SignedOut>
                <SignedIn>
                  <Homepage />
                </SignedIn>
              </div>
            </header>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
