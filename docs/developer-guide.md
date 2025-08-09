# Vyakarni Developer Guide

Complete development setup and contribution guide for Vyakarni.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Contributing](#contributing)
6. [Deployment](#deployment)

## Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (or yarn)
- **Git**: Latest version
- **Supabase CLI**: For local development
- **Code Editor**: VS Code recommended

### Environment Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/vyakarni.git
cd vyakarni
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Environment Variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. Supabase Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

#### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Application will be available at `http://localhost:5173`

### API Keys Required

For full functionality, you'll need these API keys:

#### Required APIs
- **Supabase**: Database and authentication
- **OpenAI/Grok**: AI grammar checking
- **Razorpay**: Payment processing
- **Resend**: Email services

#### Configuration
Add to Supabase Edge Function secrets:
```bash
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set XAI_API_KEY=your_grok_key
supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key
supabase secrets set RAZORPAY_SECRET_KEY=your_razorpay_secret
supabase secrets set RESEND_API_KEY=your_resend_key
```

## Project Structure

### Root Structure
```
vyakarni/
├── src/                    # React application source
├── supabase/              # Supabase configuration and functions
├── public/                # Static assets
├── docs/                  # Documentation
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

### Source Code Structure
```
src/
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── Admin/            # Admin panel components
│   ├── Billing/          # Billing and subscription components
│   ├── GrammarChecker/   # Grammar checking interface
│   ├── Navigation/       # Navigation components
│   ├── Payment/          # Payment processing components
│   └── Profile/          # User profile components
├── hooks/                # Custom React hooks
├── pages/                # Page components (routes)
├── services/             # API services and utilities
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── integrations/         # Third-party integrations
├── lib/                  # Shared libraries
├── main.tsx              # Application entry point
├── App.tsx               # Main application component
└── index.css             # Global styles and design system
```

### Supabase Structure
```
supabase/
├── functions/            # Edge Functions
│   ├── auth-webhook/     # Authentication webhooks
│   ├── grammar-check/    # Grammar checking API
│   ├── grok-*/          # Grok AI integration
│   ├── razorpay-*/      # Payment processing
│   └── send-*/          # Email services
├── migrations/           # Database migrations
├── config.toml          # Supabase configuration
└── seed.sql             # Database seed data
```

## Development Workflow

### Code Organization

#### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Handle event
  };
  
  // Render
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};
```

#### Custom Hooks
```typescript
// Example custom hook
export const useCustomHook = (param: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch data
      const result = await api.getData(param);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [param]);
  
  return { data, loading, fetchData };
};
```

### Design System

#### Tailwind Configuration
The project uses a semantic design system defined in:
- `src/index.css` - CSS variables and base styles
- `tailwind.config.ts` - Tailwind configuration

#### Color System
```css
/* Use semantic colors, not direct values */
.correct {
  @apply bg-primary text-primary-foreground;
}

.error {
  @apply bg-destructive text-destructive-foreground;
}
```

#### Component Variants
```typescript
// Use cva for component variants
const buttonVariants = cva(
  "base-button-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        primary: "primary-styles",
        destructive: "destructive-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
        lg: "large-styles",
      },
    },
  }
);
```

### API Integration

#### Supabase Client
```typescript
import { supabase } from "@/integrations/supabase/client";

// Database operations
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');

// Edge function calls
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { param: 'value' }
});
```

#### Error Handling
```typescript
// Consistent error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  toast({
    title: "Error",
    description: "Operation failed. Please try again.",
    variant: "destructive",
  });
  throw error;
}
```

### State Management

#### React Hook Patterns
```typescript
// Complex state management
const useGrammarChecker = () => {
  const [state, setState] = useState({
    inputText: '',
    corrections: [],
    isProcessing: false,
    error: null
  });
  
  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  };
  
  return { state, updateState };
};
```

#### Context for Global State
```typescript
// Global state context
const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

## Testing

### Unit Testing
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Component Testing
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles events', () => {
    const handleEvent = jest.fn();
    render(<Component onEvent={handleEvent} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleEvent).toHaveBeenCalled();
  });
});
```

### Integration Testing
```typescript
// Example integration test
describe('Grammar Checker Integration', () => {
  it('processes text correctly', async () => {
    const { result } = renderHook(() => useGrammarChecker());
    
    act(() => {
      result.current.processText('test text');
    });
    
    await waitFor(() => {
      expect(result.current.corrections).toHaveLength(1);
    });
  });
});
```

### Edge Function Testing
```bash
# Test edge functions locally
supabase functions serve

# Run function tests
supabase test db
```

## Contributing

### Git Workflow

#### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-improvement` - Code refactoring

#### Commit Messages
```
type(scope): description

feat(grammar): add advanced grammar checking
fix(billing): resolve subscription renewal issue
docs(api): update API documentation
refactor(components): improve component structure
```

#### Pull Request Process
1. **Create Feature Branch**: `git checkout -b feature/new-feature`
2. **Implement Changes**: Make your changes
3. **Test Thoroughly**: Run all tests
4. **Update Documentation**: Update relevant docs
5. **Create PR**: Submit pull request with description
6. **Code Review**: Address review feedback
7. **Merge**: Squash and merge when approved

### Code Style

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    // Custom rules
  }
};
```

#### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Documentation Standards

#### Code Documentation
```typescript
/**
 * Processes text for grammar corrections
 * @param inputText - The text to process
 * @param options - Processing options
 * @returns Promise with correction results
 */
export const processGrammar = async (
  inputText: string,
  options: ProcessingOptions
): Promise<CorrectionResult> => {
  // Implementation
};
```

#### Component Documentation
```typescript
/**
 * Grammar checker component
 * 
 * @component
 * @example
 * <GrammarChecker
 *   onCorrection={(result) => console.log(result)}
 *   disabled={false}
 * />
 */
export const GrammarChecker: React.FC<GrammarCheckerProps> = (props) => {
  // Component implementation
};
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

#### Production Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

#### Supabase Production Setup
```bash
# Link to production project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy

# Run migrations
supabase db push
```

### Deployment Platforms

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

#### Optimization Techniques
- **Code Splitting**: Lazy load components
- **Image Optimization**: Use WebP format
- **Caching**: Implement proper caching headers
- **CDN**: Use CDN for static assets

### Monitoring

#### Error Tracking
- **Sentry**: For error monitoring
- **LogRocket**: For session replay
- **Analytics**: User behavior tracking

#### Performance Monitoring
- **Web Vitals**: Core web vitals tracking
- **Lighthouse**: Performance auditing
- **Real User Monitoring**: Production performance

---

For more detailed information about specific components or features, refer to the individual component documentation or contact the development team.