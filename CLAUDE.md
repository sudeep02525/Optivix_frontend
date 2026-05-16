# NexusIDE - Claude AI Integration Guide

## 🤖 AI Integration Overview

NexusIDE is designed to integrate with Claude AI for advanced code analysis and auto-healing capabilities. This guide explains how to set up and use Claude AI with NexusIDE.

## 🔑 API Setup

### 1. Get Your Claude API Key

1. Visit [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (keep it secret!)

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

**Important**: Never commit `.env.local` to version control!

## 🔍 Code Analysis Features

### Bug Detection

Claude analyzes code for:
- Missing React hook dependencies
- Unused variables and imports
- Type mismatches
- Logic errors
- Common anti-patterns

**Example**:
```typescript
// Claude detects: Missing 'users' dependency in useEffect
useEffect(() => {
  setUsers(data)
}, []) // ❌ Should include 'users'
```

### Security Vulnerability Detection

Claude identifies:
- SQL Injection vulnerabilities
- XSS (Cross-Site Scripting) risks
- Insecure API calls
- Exposed secrets
- CORS misconfiguration

**Example**:
```typescript
// Claude detects: SQL Injection vulnerability
const sql = "SELECT * FROM users WHERE id = '" + userId + "'"
// ❌ User input directly in SQL query
```

### Performance Optimization

Claude suggests:
- Inefficient rendering patterns
- Memory leaks
- Unnecessary re-renders
- Expensive operations in render
- Memoization opportunities

**Example**:
```typescript
// Claude detects: Inefficient key usage
{users.map((user, index) => (
  <div key={index}> {/* ❌ Using index as key */}
    {user.name}
  </div>
))}
```

## 🔧 API Integration

### Making API Calls to Claude

```typescript
// Example: Analyze code with Claude
async function analyzeCodeWithClaude(code: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })

  const data = await response.json()
  return data
}
```

### Backend API Route

Create `app/api/analyze/route.ts`:

```typescript
import { Anthropic } from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const { code } = await request.json()

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this code for bugs, security issues, and performance problems:\n\n${code}`,
      },
    ],
  })

  return Response.json(message)
}
```

## 🛠️ Auto-Heal Implementation

### Healing Process

1. **Analysis** - Claude analyzes the code
2. **Issue Detection** - Identifies problems
3. **Fix Generation** - Generates corrected code
4. **Validation** - Verifies fixes are correct
5. **Application** - Updates the editor

### Example Implementation

```typescript
async function autoHealCode(code: string) {
  const response = await fetch('/api/heal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })

  const { healedCode, fixes } = await response.json()
  return { healedCode, fixes }
}
```

### Backend Healing Route

Create `app/api/heal/route.ts`:

```typescript
import { Anthropic } from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const { code } = await request.json()

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Fix all bugs, security issues, and performance problems in this code. Return only the fixed code:\n\n${code}`,
      },
    ],
  })

  const healedCode = message.content[0].type === 'text' ? message.content[0].text : ''

  return Response.json({
    healedCode,
    fixes: [
      // Parse and return list of fixes
    ],
  })
}
```

## 📊 Analysis Response Format

### Issue Detection Response

```json
{
  "issues": [
    {
      "type": "bug",
      "severity": "high",
      "title": "Missing useEffect Dependency",
      "description": "The useEffect hook is missing the 'users' dependency",
      "line": 7,
      "suggestion": "Add 'users' to the dependency array"
    },
    {
      "type": "security",
      "severity": "critical",
      "title": "SQL Injection Vulnerability",
      "description": "User input is directly concatenated into SQL query",
      "line": 14,
      "suggestion": "Use parameterized queries"
    }
  ],
  "healthScore": 45,
  "summary": "4 issues found: 1 critical, 2 high, 1 medium"
}
```

## 🎯 Prompt Engineering

### Effective Prompts for Code Analysis

**Bug Detection**:
```
Analyze this React code for bugs. Look for:
- Missing hook dependencies
- Unused variables
- Type mismatches
- Logic errors

Return a JSON array of issues with: type, severity, line, description, suggestion
```

**Security Analysis**:
```
Analyze this code for security vulnerabilities. Look for:
- SQL Injection
- XSS attacks
- Insecure API calls
- Exposed secrets

Return a JSON array of vulnerabilities with: type, severity, line, description, fix
```

**Performance Optimization**:
```
Analyze this code for performance issues. Look for:
- Inefficient rendering
- Memory leaks
- Unnecessary re-renders
- Expensive operations

Return a JSON array of issues with: type, severity, line, description, optimization
```

## 🔐 Security Best Practices

### API Key Management
- Never expose API keys in client-side code
- Use environment variables
- Rotate keys regularly
- Use separate keys for dev/prod

### Rate Limiting
```typescript
// Implement rate limiting to prevent abuse
const rateLimit = new Map()

function checkRateLimit(userId: string) {
  const now = Date.now()
  const userLimit = rateLimit.get(userId) || []
  const recentRequests = userLimit.filter(t => now - t < 60000)
  
  if (recentRequests.length >= 10) {
    throw new Error('Rate limit exceeded')
  }
  
  rateLimit.set(userId, [...recentRequests, now])
}
```

### Input Validation
```typescript
// Validate code input before sending to Claude
function validateCode(code: string) {
  if (!code || code.length === 0) {
    throw new Error('Code cannot be empty')
  }
  
  if (code.length > 50000) {
    throw new Error('Code too large (max 50KB)')
  }
  
  return true
}
```

## 📈 Performance Optimization

### Caching Results
```typescript
const analysisCache = new Map()

async function analyzeCodeWithCache(code: string) {
  const hash = hashCode(code)
  
  if (analysisCache.has(hash)) {
    return analysisCache.get(hash)
  }
  
  const result = await analyzeCodeWithClaude(code)
  analysisCache.set(hash, result)
  
  return result
}
```

### Streaming Responses
```typescript
// Stream analysis results for better UX
async function* analyzeCodeStream(code: string) {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Analyze this code:\n\n${code}`,
      },
    ],
  })

  for await (const event of response) {
    if (event.type === 'content_block_delta') {
      yield event.delta.text
    }
  }
}
```

## 🧪 Testing Claude Integration

### Unit Tests
```typescript
describe('Claude Integration', () => {
  it('should analyze code for bugs', async () => {
    const code = `
      useEffect(() => {
        setUsers(data)
      }, [])
    `
    
    const result = await analyzeCodeWithClaude(code)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        type: 'bug',
        severity: 'high',
      })
    )
  })

  it('should detect SQL injection', async () => {
    const code = `
      const sql = "SELECT * FROM users WHERE id = '" + userId + "'"
    `
    
    const result = await analyzeCodeWithClaude(code)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        type: 'security',
        severity: 'critical',
      })
    )
  })
})
```

## 📚 Claude Models

### Available Models

| Model | Context | Speed | Cost |
|-------|---------|-------|------|
| claude-3-5-sonnet-20241022 | 200K | Fast | Low |
| claude-3-opus-20250219 | 200K | Slow | High |
| claude-3-haiku-20250307 | 200K | Very Fast | Very Low |

### Model Selection
- **Sonnet**: Best for most tasks (recommended)
- **Opus**: For complex analysis
- **Haiku**: For quick, simple tasks

## 🚀 Advanced Features

### Multi-Language Support
```typescript
// Detect language and adjust analysis
function detectLanguage(code: string) {
  if (code.includes('import React')) return 'typescript'
  if (code.includes('def ')) return 'python'
  if (code.includes('function ')) return 'javascript'
  return 'unknown'
}
```

### Custom Analysis Rules
```typescript
// Define custom analysis rules
const customRules = [
  {
    name: 'no-console-logs',
    severity: 'warning',
    pattern: /console\.(log|warn|error)/,
  },
  {
    name: 'no-var',
    severity: 'error',
    pattern: /\bvar\s+/,
  },
]
```

### Batch Analysis
```typescript
// Analyze multiple files
async function analyzeMultipleFiles(files: File[]) {
  const results = await Promise.all(
    files.map(file => analyzeCodeWithClaude(file.content))
  )
  return results
}
```

## 🔗 Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [Claude Models](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [API Reference](https://docs.anthropic.com/en/api/getting-started)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-a-bot)

## 🐛 Troubleshooting

### Common Issues

**API Key Not Found**
```
Error: ANTHROPIC_API_KEY is not set
Solution: Add ANTHROPIC_API_KEY to .env.local
```

**Rate Limit Exceeded**
```
Error: Rate limit exceeded
Solution: Implement caching and rate limiting
```

**Invalid Response Format**
```
Error: Unexpected response format
Solution: Validate and parse Claude's response correctly
```

## 📞 Support

For issues with Claude API:
- [Anthropic Support](https://support.anthropic.com)
- [Discord Community](https://discord.gg/anthropic)
- [GitHub Issues](https://github.com/anthropics/anthropic-sdk-python/issues)

---

**NexusIDE + Claude = The Future of Development** 🚀
