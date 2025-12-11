import { DependencyList, useCallback, useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes, fetchAuthSession, AuthUser, FetchUserAttributesOutput, AuthSession} from "aws-amplify/auth";

export const useUser = (): [
  AuthUser | undefined,
  FetchUserAttributesOutput | undefined,
  AuthSession | undefined
] => {
  const [user, setUser] = useState<AuthUser>();
  const [attrs, setAttrs] = useState<FetchUserAttributesOutput>();
  const [session, setSession] = useState<AuthSession>();

  useEffect(() => {
    Promise.all([
      getCurrentUser(),
      fetchUserAttributes(),
      fetchAuthSession(),
    ]).then(([user, attrs, session]) => {
      setUser(user);
      setAttrs(attrs);
      setSession(session);
    });
  }, []);

  return [user, attrs, session];
}

