import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import Constants from "expo-constants";

const { EXPO_GOOGLE_CLIENT_ID } = Constants.expoConfig?.extra as {
  EXPO_GOOGLE_CLIENT_ID: string;
};

WebBrowser.maybeCompleteAuthSession();

const useGoogleLogin = () => {
  const CLIENT_ID = EXPO_GOOGLE_CLIENT_ID;

  // CLIENT_ID 검증
  if (!CLIENT_ID) {
    console.error("❌ EXPO_GOOGLE_CLIENT_ID가 설정되지 않았습니다!");
    console.error("🔍 app.config.js 또는 .env 파일을 확인해주세요.");
  } else {
    console.log(
      "✅ Google Client ID 확인됨:",
      CLIENT_ID.substring(0, 10) + "..."
    );
  }

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
    userInfoEndpoint: "https://www.googleapis.com/oauth2/v2/userinfo",
  };

  // 백엔드 JWT 토큰 교환 URL
  const backendTokenExchangeUrl =
    "https://jeonlog-env.eba-qstxpqtg.ap-northeast-2.elasticbeanstalk.com/oauth2/redirect?token";

  const redirectUri =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_NGROK_URL ||
        (typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:8081")
      : AuthSession.makeRedirectUri();

  // 리디렉트 URI 검증
  console.log("🌐 Platform:", Platform.OS);
  console.log("🔗 Redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  return {
    promptAsync,
    request,
    response,
    backendTokenExchangeUrl,
  };
};

export default useGoogleLogin;
