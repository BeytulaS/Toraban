import { FcGoogle } from "react-icons/fc";
import { FaMeta, FaApple } from "react-icons/fa6";
import { useState } from "react";
import { OAuthSignIn, signIn, signUp } from "../services/userServices";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, setIsOpen }) {
  const [formType, setFormType] = useState("login");

  const handleModalClose = (e) => {
    if (e.target.classList.contains("modal-container")) setIsOpen(false);
    return;
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="overlay fixed top-0 left-0 w-screen h-screen bg-black opacity-50 z-10"></div>
          <div
            onClick={(e) => handleModalClose(e)}
            className="modal-container fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-20"
          >
            <div className="modal w-[95%] overflow-hidden md:max-w-lg bg-light dark:bg-dark rounded-sm flex flex-col  items-center py-8">
              {formType === "login" ? (
                <LoginForm setFormType={setFormType} setIsOpen={setIsOpen} />
              ) : (
                <RegisterForm setFormType={setFormType} setIsOpen={setIsOpen} />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function LoginForm({ setFormType, setIsOpen }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSignIn() {
    setError("");

    signIn(user.email, user.password)
      .then(() => setIsOpen(false))
      .then(() => navigate("/boards"))
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleOAuthSignIn(provider) {
    setError("");

    OAuthSignIn(provider)
      .then(() => setIsOpen(false))
      .then(() => navigate("/boards"))
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <form action="" className="w-4/5 md:w-3/5 flex flex-col gap-10 p-4">
      <h2 className="text-3xl font-semibold text-center">Sign in</h2>
      {error && <p className="text-red text-center">{error}</p>}
      <div className="input-box relative">
        <input
          type="email"
          id="email"
          required
          className="w-full peer bg-transparent placeholder-transparent text-dark dark:text-light border-b-2 border-b-dark dark:border-b-light focus:border-b-2 dark:focus:border-b-orange focus:outline-none focus:border-b-orange py-0.5"
          placeholder="Email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          value={user.email}
        />
        <label
          htmlFor="email"
          className="absolute font-semibold -top-6 left-0 text-dark dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:-top-6 transition-all"
        >
          Email
        </label>
      </div>
      <div className="input-box relative">
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          className="w-full peer bg-transparent placeholder-transparent text-dark dark:text-light border-b-2 border-b-dark dark:border-b-light focus:border-b-2 dark:focus:border-b-orange focus:outline-none focus:border-b-orange py-0.5"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          value={user.password}
        />
        <label
          htmlFor="password"
          className="absolute font-semibold -top-6 left-0 text-dark dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:-top-6 transition-all"
        >
          Password
        </label>
      </div>
      <button
        type="button"
        className="w-full  text-white bg-orange  p-1 rounded-sm text-lg font-semibold"
        onClick={() => handleSignIn()}
      >
        Sign in
      </button>
      <div className="buttons w-full flex items-center justify-center gap-6 text-3xl">
        <button type="button" onClick={() => handleOAuthSignIn("google")}>
          <FcGoogle />
        </button>
        <button type="button" onClick={() => handleOAuthSignIn("apple")}>
          <FaApple />
        </button>
        <button type="button" onClick={() => handleOAuthSignIn("meta")}>
          <FaMeta />
        </button>
      </div>
      <button type="button" onClick={() => setFormType("register")}>
        Don't have an account? <br />
        <span className="underline underline-offset-4">Create one here</span>
      </button>
    </form>
  );
}

function RegisterForm({ setFormType, setIsOpen }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSignUp() {
    setError("");

    signUp(user.email, user.password)
      .then(() => setIsOpen(false))
      .then(() => navigate("/boards"))
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleOAuthSignIn(provider) {
    setError("");

    OAuthSignIn(provider)
      .then(() => setIsOpen(false))
      .then(() => navigate("/boards"))
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <form action="" className="w-4/5 md:w-3/5 flex flex-col gap-10 p-4">
      <h2 className="text-3xl font-semibold text-center">Sign up</h2>
      <div className="input-box relative my-1">
        <input
          type="email"
          id="email"
          className="w-full peer bg-transparent placeholder-transparent text-dark dark:text-light border-b-2 border-b-dark dark:border-b-light focus:border-b-2 dark:focus:border-b-orange focus:outline-none focus:border-b-orange py-0.5"
          placeholder="Email"
          required
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          value={user.email}
        />
        <label
          htmlFor="email"
          className="absolute font-semibold -top-6 left-0 text-dark dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:-top-6 transition-all"
        >
          Email
        </label>
      </div>
      <div className="input-box relative my-1">
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          className="w-full peer bg-transparent placeholder-transparent border-b-2 border-b-dark text-dark dark:text-light focus:border-orange dark:border-b-light focus:border-b-2 dark:focus:border-b-orange focus:outline-none py-0.5"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          value={user.password}
        />
        <label
          htmlFor="password"
          className="absolute font-semibold -top-6 text-dark left-0 dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:opacity-100 peer-focus:-top-6 transition-all"
        >
          Password
        </label>
      </div>
      <div className="input-box relative my-1">
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm password"
          required
          className="w-full peer bg-transparent placeholder-transparent border-b-2 text-dark dark:text-light border-b-dark focus:border-b-orange dark:border-b-light dark:focus:border-b-orange focus:border-b-2  focus:outline-none py-0.5"
        />
        <label
          htmlFor="confirm-password"
          className="absolute font-semibold -top-6 left-0 text-dark dark:text-light peer-placeholder-shown:top-0 peer-focus:h-6 peer-focus:text-orange peer-focus:opacity-100 peer-focus:-top-6 transition-all"
        >
          Confirm password
        </label>
      </div>
      <button
        type="button"
        className="w-full   text-white bg-orange p-1 rounded-sm text-lg  font-semibold"
        onClick={() => handleSignUp()}
      >
        Sign up
      </button>

      <div className="buttons w-full flex items-center justify-center gap-6 ">
        <button type="button" onClick={() => handleOAuthSignIn("google")}>
          <FcGoogle className="h-8 w-8" />
        </button>
        <button type="button" onClick={() => handleOAuthSignIn("apple")}>
          <FaApple className="h-8 w-8" />
        </button>
        <button type="button" onClick={() => handleOAuthSignIn("meta")}>
          <FaMeta className="h-8 w-8" />
        </button>
      </div>
      <button type="button" onClick={() => setFormType("login")}>
        Already have an account? <br />
        <span className="underline">Log in here</span>
      </button>
    </form>
  );
}
