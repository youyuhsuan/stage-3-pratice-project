import { Container } from "@/app/components/style/Container.styled";
import { H1 } from "@/app/components/style/Fonts.styled";

import Nav from "@/app/components/Nav";
import SignInSection from "@/app/components/SignInSection";
import SignInForm from "@/app/components/SignInForm";
import SignUpForm from "@/app/components/SignUpForm";

import { getSessionData } from "@/app/utils/session";

export default async function Home() {
  const sessionData = await getSessionData();

  return (
    <main>
      <Nav />
      <section>
        <Container>
          {sessionData ? (
            <SignInSection userEmail={sessionData.userEmail} />
          ) : (
            <>
              <H1>Welcome</H1>
              <SignInForm />
            </>
          )}
          <SignUpForm />
        </Container>
      </section>
    </main>
  );
}
