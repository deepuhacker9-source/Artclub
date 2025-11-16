import "../styles/globals.css"; // keep your styles import if present
import { UserProvider } from "../lib/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;