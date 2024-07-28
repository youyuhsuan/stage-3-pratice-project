import Link from "next/link";
import AccountSecion from "@/app/components/AccountSecion";
import { Container } from "@/app/components/style/Container.styled";
import { H1 } from "@/app/components/style/Fonts.styled";

export default function Page() {
  return (
    <main>
      <Container>
        <Link href="/">
          <H1>Transactions</H1>
        </Link>
        <AccountSecion />
      </Container>
    </main>
  );
}
