import React from 'react';
import {Button, InputItem, List} from '@ant-design/react-native';

export default function Login() {
  return (
    <>
      <List>
        <InputItem
          clear
          placeholder="Email"
          ref={(el) => (this.inputRef = el)}
        />

        <List.Item>
          <Button
            onPress={() => {
              this.inputRef.focus();
            }}
            type="primary">
            Login
          </Button>
        </List.Item>
      </List>
    </>
  );
}
