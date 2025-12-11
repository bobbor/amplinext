"use client";

import React, { useCallback, useEffect, useState, useLayoutEffect } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { confirmSignIn, signIn, fetchAuthSession} from 'aws-amplify/auth'
import { State, usePromise } from "@/app/hooks/usePromise";
import {useRouter} from 'next/navigation'

type SignInFieldType = {
  username: string;
  password: string;
};

type ConfirmSignInFieldType = {
  new_password: string;
}

const LoginForm: React.FC<{
  state: State
  onSubmit: NonNullable<FormProps<SignInFieldType>["onFinish"]>
}> = ({
  state,
  onSubmit
                   }) => {
  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 600}}
      initialValues={{remember: true}}
      onFinish={onSubmit}
      onFinishFailed={() => {
        console.log('signInFailed')
      }}
      autoComplete="off"
    >
      <Form.Item<SignInFieldType>
        label="Username"
        name="username"
        rules={[{required: true, message: "Please input your username!"}]}
      >
        <Input/>
      </Form.Item>

      <Form.Item<SignInFieldType>
        label="Password"
        name="password"
        rules={[{required: true, message: "Please input your password!"}]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" disabled={state.pending || state.failed} loading={state.pending}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}


const NewPasswordForm: React.FC<{
  state: State
  onSubmit: NonNullable<FormProps<ConfirmSignInFieldType>["onFinish"]>
}> = ({
        state,
        onSubmit
      }) => {
  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 600}}
      initialValues={{remember: true}}
      onFinish={onSubmit}
      onFinishFailed={() => {
        console.log('confirmSignIn Failed')
      }}
      autoComplete="off"
    >
      <Form.Item<ConfirmSignInFieldType>
        label="new password"
        name="new_password"
        rules={[{required: true, message: "Please write a new password"}]}
      >
        <Input.Password/>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit" disabled={state.pending || state.failed} loading={state.pending}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const Page: React.FC = () => {
  const [loginState, doLogin] = usePromise(signIn);
  const [confirmState, doConfirm] = usePromise(confirmSignIn);
  const [view, setView] = useState<'login' | 'confirm'>('login')
  const { push } = useRouter();
  useLayoutEffect(() => {
    fetchAuthSession().then(session => {
      if(session.tokens) {
        push('/')
      }
    })
  }, []);

  useEffect(() => {
    const { result: loginResult } = loginState;
    const { result: confirmResult } = confirmState;

    if(confirmResult && view === 'confirm') {
      const { isSignedIn, nextStep } = confirmResult;

      if(isSignedIn) {
        push("/");
      } else {
        if(nextStep.signInStep !== "DONE") {
          switch(nextStep.signInStep) {
            default:
              console.log("unhandled signinStep", nextStep.signInStep);
          }
        } else {
          // we are not signed in, but done. this means error.
          console.log("Failed confirm");
        }
      }
    }

    if(loginResult && view === 'login') {
      const { isSignedIn, nextStep } = loginResult;

      if(isSignedIn) {
        push("/");
      } else {
        if(nextStep.signInStep !== "DONE") {
          switch(nextStep.signInStep) {
            case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
              setView('confirm');
              break;
            default:
              console.log("unhandled signinStep", nextStep.signInStep);
          }
        } else {
          // we are not signed in, but done. this means error.
          console.log("failed login");
        }
      }
    }
  }, [confirmState, loginState, view]);

  const handleLogin = useCallback<NonNullable<FormProps<SignInFieldType>["onFinish"]>>(async ({ username, password }) => {
    doLogin({ username, password });
  }, [doLogin]);

  const handleConfirm = useCallback<NonNullable<FormProps<ConfirmSignInFieldType>['onFinish']>>(async ({new_password}) => {
    doConfirm({
      challengeResponse: new_password,
    })
  }, [doConfirm]);

  return view === 'login' ? (<LoginForm state={loginState} onSubmit={handleLogin} />) : (
    <NewPasswordForm state={confirmState} onSubmit={handleConfirm} />
  )
};

export default Page;