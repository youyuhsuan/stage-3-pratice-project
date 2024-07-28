"use client";

import { H1, Slogen } from "@/app/components/style/Fonts.styled";
import {
  Container,
  LoggedInContainer,
} from "@/app/components/style/Container.styled";
import { Button } from "@/app/components/style/Form.styled";

import Link from "next/link";
import axios from "axios";

import { useRouter } from "next/navigation";

interface LoggedInSectionProps {
  userEmail: string;
}

export default function LoggedInSection({ userEmail }: LoggedInSectionProps) {
  const router = useRouter();

  const logoutUser = async () => {
    try {
      // TODO:axios與fetch詳細分析, axios物件 , fetch
      await axios.get("/api/users/logout");
      router.refresh();
    } catch (error: any) {
      console.log("We could not logout the user: " + error.message);
    }
  };

  return (
    <Container>
      <LoggedInContainer>
        <H1>Welcome back, {userEmail}!</H1>
        <Button onClick={logoutUser}>Log out</Button>
      </LoggedInContainer>

      <Link href="/accounting">
        <Slogen>Click to start</Slogen>
      </Link>
    </Container>
  );
}
