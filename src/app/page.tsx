"use client";

import { Avatar, Badge, Card, Flex, Button, Descriptions } from 'antd';
import { useUser } from "@/app/hooks/useUser";
import { usePromise } from "@/app/hooks/usePromise";
import { signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { relTime } from "@/utils/date";


const App: React.FC = () => {
  const [user, attrs, session] = useUser();
  const [logoutState, doSignOut] = usePromise(signOut)
  const { push } = useRouter();
  const [{ accessToken, idToken }, setTokens] = useState({
    accessToken: session?.tokens?.accessToken,
    idToken: session?.tokens?.idToken
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens({accessToken: session?.tokens?.accessToken, idToken: session?.tokens?.idToken})
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    if(logoutState.succeeded) {
      push("/login");
    }
  }, [logoutState])

  return (
    <Flex justify="space-between">
      <Descriptions title={"User Info"} bordered items={[
        {
          key: '1',
          label: "user",
          span: 3,
          children: (
            <Badge.Ribbon
              text={user?.signInDetails?.authFlowType}
              color="#696FC7"
              styles={{
                root: {
                  width: 400,
                  border: '1px solid #d9d9d9',
                  borderRadius: 5,
                },
                content: {
                  fontSize: '12px',
                },
              }}
            >
              <Card title={user?.signInDetails?.loginId} size="small" key={`${attrs?.sub}:${attrs?.updated_at}`}>
                <Flex gap="small">
                  <Avatar shape="square" size="large" style={{ flex: '0 0 auto'}} />
                  id: {attrs?.sub}<br/>
                  last updated: {relTime(attrs?.updated_at, { seconds: false })}
                </Flex>
              </Card>
            </Badge.Ribbon>
          )
        }, {
          key: "2",
          label: "accessToken",
          children: <dl>
            <dt>auth time</dt>
            <dd>{relTime(accessToken?.payload.auth_time as unknown as string)}</dd>
            <dt>iat</dt>
            <dd>{relTime(accessToken?.payload.iat as unknown as string)}</dd>
            <dt>exp</dt>
            <dd>{relTime(accessToken?.payload.exp as unknown as string)}</dd>
          </dl>
        }, {
          key: "3",
          label: "idToken",
          children: <dl>
            <dt>auth time</dt>
            <dd>{relTime(idToken?.payload.auth_time as unknown as string)}</dd>
            <dt>iat</dt>
            <dd>{relTime(idToken?.payload.iat as unknown as string)}</dd>
            <dt>exp</dt>
            <dd>{relTime(idToken?.payload.exp as unknown as string)}</dd>
          </dl>
        }
      ]} />
      <Button onClick={() => { doSignOut()}}>
        sign out
      </Button>
    </Flex>
  );
};

export default App;