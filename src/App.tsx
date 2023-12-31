import { useEffect, useState } from "react";
import { config, passport } from "@imtbl/sdk";
import "./App.css";

const baseConfig = new config.ImmutableConfiguration({
  environment: config.Environment.SANDBOX,
});

const passportInstance = new passport.Passport({
  baseConfig,
  clientId: "SdUitEnEh6iFUzq38sWEbBX3MSJoPOv2",
  redirectUri: "http://localhost:5173/",
  logoutRedirectUri: "http://localhost:5173/",
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

interface UserProfile {
  email?: string;
  nickname?: string;
  sub: string;
}

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
 
 
  useEffect(() => {
    passportInstance.logoutSilentCallback("/");
  }, []);


  useEffect(() => {
    passportInstance.loginCallback();
  }, []);

  useEffect(() => {
    async function initializeProvider() {
      const provider = await passportInstance.connectImxSilent();
      if (!provider) {
        await passportInstance.connectImx();
      }
    }
    initializeProvider();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const userProfile = await passportInstance.getUserInfo();
      if (userProfile) {
        setUser(userProfile);
      } else {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
               <>
               <h1>Welcome, {user.email}!</h1>
               <button onClick={() => passportInstance.logout() }>Logout</button>
             </>
     
      ) : (
        <button onClick={() => passportInstance.connectImx()}>Login</button>
      )}
    </div>
  );
}

export { App };
