import React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { signIn } from "../hooks";
import Copyright from "../src/Copyright";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Button onClick={signIn}>Login with Google</Button>
        <Copyright />
      </Box>
    </Container>
  );
}
