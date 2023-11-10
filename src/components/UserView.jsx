export default function UserView({ setUser }) {
  return (
    <section>
      <h1>UserView</h1>
      <button type="button" onClick={() => setUser(false)}>
        Logout
      </button>
    </section>
  );
}
