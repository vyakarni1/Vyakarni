import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
}

export const WelcomeEmail = ({ userName, userEmail }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>व्याकरणी में आपका स्वागत है! आइए शुरू करते हैं।</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>व्याकरणी में आपका स्वागत है! 🎉</Heading>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            नमस्ते {userName},
          </Text>

          <Text style={paragraph}>
            व्याकरणी परिवार में आपका स्वागत है! आपने एक महत्वपूर्ण कदम उठाया है हिंदी भाषा की शुद्धता और सुंदरता को बेहतर बनाने के लिए।
          </Text>

          <Text style={paragraph}>
            व्याकरणी के साथ आप कर सकते हैं:
          </Text>

          <ul style={featureList}>
            <li style={featureItem}>✅ हिंदी व्याकरण की त्वरित जांच</li>
            <li style={featureItem}>✨ शैली और प्रवाह में सुधार</li>
            <li style={featureItem}>📝 पेशेवर दस्तावेज़ों की शुद्धता</li>
            <li style={featureItem}>🎯 वर्तनी की सटीक जांच</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href="https://vyakarni.com/dashboard">
              अभी शुरू करें
            </Button>
          </Section>

          <Text style={paragraph}>
            आपके पास <strong>500 मुफ्त शब्द</strong> मिले हैं! इनका उपयोग करके व्याकरणी की शक्ति का अनुभव करें।
          </Text>

          <Hr style={hr} />

          <Text style={helpText}>
            <strong>मदद चाहिए?</strong><br />
            हमारी टीम हमेशा आपकी सहायता के लिए तैयार है।
          </Text>

          <Section style={linksSection}>
            <Link href="https://vyakarni.com/contact" style={link}>
              संपर्क करें
            </Link>
            {" • "}
            <Link href="https://vyakarni.com/about" style={link}>
              हमारे बारे में
            </Link>
            {" • "}
            <Link href="https://vyakarni.com/pricing" style={link}>
              प्रीमियम प्लान
            </Link>
          </Section>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            यह ईमेल {userEmail} को भेजा गया है।<br />
            व्याकरणी टीम द्वारा प्रेम के साथ बनाया गया।
          </Text>
          
          <Text style={footerLink}>
            <Link href="https://vyakarni.com" style={link}>
              vyakarni.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 24px',
  textAlign: 'center' as const,
  backgroundColor: '#4f46e5',
  color: '#ffffff',
};

const content = {
  padding: '24px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const greeting = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '16px 0',
};

const featureList = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  paddingLeft: '20px',
  margin: '16px 0',
};

const featureItem = {
  margin: '8px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  border: 'none',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const helpText = {
  fontSize: '14px',
  color: '#6b7280',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const linksSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
  fontSize: '14px',
};

const footer = {
  backgroundColor: '#f9fafb',
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 8px',
  lineHeight: '1.4',
};

const footerLink = {
  fontSize: '12px',
  margin: '0',
};