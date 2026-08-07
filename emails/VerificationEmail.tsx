import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Link,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  username,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify your email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Please verify your email address to continue.</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username || "there"},</Heading>
        </Row>
        <Row>
          <Text>
            Welcome to Inkognito! To complete your registration and secure your account, please click the button below to verify your email address.
          </Text>
        </Row>
        <Row>
          <Link href={verificationUrl}>
            <Button style={{ backgroundColor: '#6366f1', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', fontWeight: 'bold' }}>
              Verify Email Address
            </Button>
          </Link>
        </Row>
        <Row>
          <Text style={{ fontSize: '12px', color: '#6b7280', marginTop: '20px' }}>
            If you did not create an account, you can safely ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
