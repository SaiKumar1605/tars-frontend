// src/Login.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase-config";

export default function Login({ setUser }) {
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken(true);
    localStorage.setItem("tars_user", JSON.stringify({ email: result.user.email, token }));
    setUser({ email: result.user.email, token }); 
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-xl"
        onClick={login}
      >
        Sign in with Google
      </button>
    </div>
  );
}
