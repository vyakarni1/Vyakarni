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
    <Preview>व्याकरणी में आपका स्वागत है! आइये प्रारम्भ करते हैं।</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>व्याकरणी में आपका स्वागत है! 🎉</Heading>
        </Section>

        <Section style={content}>
          <Text style={greeting}>
            नमस्ते प्रयोगकर्ता,
          </Text>

          <Text style={paragraph}>
            व्याकरणी परिवार में आपका स्वागत है! आपने एक महत्वपूर्ण एवं स्वागतयोग्य निर्णय लिया है। आप हिंदी भाषा को शुद्ध और सुंदर रूप में उपयोग करने हेतु निम्न प्रकार से व्याकरणी का प्रयोग कर सकते हैं:
          </Text>

          <ul style={featureList}>
            <li style={featureItem}>✅ हिंदी व्याकरण की त्वरित जाँच</li>
            <li style={featureItem}>✨ वाक्य-संरचना, भाषा सौष्ठव, शैली और प्रवाह सुधार</li>
            <li style={featureItem}>📝 व्यवसायिक प्रपत्रों का लेखन एवं अन्य विषयवस्तुओं (कंटेंट) का निर्माण</li>
            <li style={featureItem}>🎯 वर्तनी एवं विराम चिह्नों की सटीक जाँच</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href="https://vyakarni.com/dashboard">
              अभी आरम्भ करें
            </Button>
          </Section>

          <Text style={paragraph}>
            आपको <strong>500 शब्द नि:शुल्क</strong> मिले हैं! इनका उपयोग कर व्याकरणी की शक्ति का अनुभव करें।
          </Text>

          <Hr style={hr} />

          <Text style={helpText}>
            <strong>क्या आपको कुछ सहायता चाहिये?</strong><br />
            हमारे समर्पित सदस्य सदा आपकी सेवा में तत्पर है।
          </Text>

          <Section style={linksSection}>
            <Link href="https://vyakarni.com/contact" style={link}>
              संपर्क करें
            </Link>
            {" • "}
            <Link href="https://vyakarni.com/about" style={link}>
              हमारे विषय में
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