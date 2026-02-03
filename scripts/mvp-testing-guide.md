# dot MVP Testing Guide

This guide provides comprehensive instructions for testing dot MVP features with users.

## MVP Features Overview

The dot MVP focuses on core features that enable effective agent communication and testing:

### Core Features
1. **ClawBrain Memory System**
   - Semantic search capabilities
   - OpenAI embeddings integration
   - Conversation memory management

2. **Gateway Service**
   - Multi-channel support (WhatsApp, Discord, Telegram)
   - Real-time message routing
   - Health monitoring and metrics

3. **User Interface**
   - Agent management dashboard
   - Memory exploration tools
   - Channel configuration interface

4. **Channel Integration**
   - WhatsApp Web (Baileys)
   - Discord Bot API
   - Telegram Bot API

## Testing Environment Setup

### Local Development (WSL2)
```bash
# 1. Setup WSL2 environment
./scripts/setup-wsl2.sh

# 2. Build dot
cd ~/dot
pnpm install
pnpm ui:build
pnpm build

# 3. Start services
dot gateway --port 18789 --verbose &
cd ui && pnpm dev &
```

### Cloud Deployment
```bash
# Deploy to cloud platform
./scripts/deploy-mvp.sh

# Configure channels
dot config set channels.whatsapp.gateway https://your-app.fly.dev
dot config set channels.discord.gateway https://your-app.fly.dev
```

## MVP Testing Checklist

### Gateway Testing
- [ ] Gateway starts successfully
- [ ] Health endpoint responds: `/health`
- [ ] Gateway status endpoint: `/gateway/status`
- [ ] Metrics endpoint: `/metrics`
- [ ] WebSocket connections work

### Memory System Testing
- [ ] Memory search functionality
- [ ] Embedding generation
- [ ] Conversation persistence
- [ ] Memory retrieval performance

### Channel Testing
- [ ] WhatsApp connection
- [ ] Discord bot responses
- [ ] Telegram bot functionality
- [ ] Message routing accuracy

### UI Testing
- [ ] Agent dashboard loads
- [ ] Memory tab accessible
- [ ] Channel configuration works
- [ ] Onboarding flow completes

## User Testing Scenarios

### Scenario 1: Basic Agent Communication
1. **Setup**: Deploy gateway and configure WhatsApp
2. **Test**: Send message to agent through WhatsApp
3. **Verify**: Agent responds with appropriate memory context
4. **Metrics**: Response time < 2s, accuracy > 90%

### Scenario 2: Memory-Enhanced Conversations
1. **Setup**: Enable memory search in configuration
2. **Test**: Have extended conversation with agent
3. **Verify**: Agent references previous conversations accurately
4. **Metrics**: Memory retrieval accuracy > 85%

### Scenario 3: Multi-Channel Consistency
1. **Setup**: Configure multiple channels (Discord + WhatsApp)
2. **Test**: Send same message through different channels
3. **Verify**: Consistent agent responses across channels
4. **Metrics**: Response consistency > 95%

### Scenario 4: Onboarding Flow
1. **Setup**: Fresh dot installation
2. **Test**: Complete onboarding wizard
3. **Verify**: All steps complete successfully
4. **Metrics**: Completion rate > 90%

## Performance Benchmarks

### Response Times
- Gateway health check: < 100ms
- Agent message processing: < 2s
- Memory search queries: < 500ms
- Channel message routing: < 1s

### Resource Usage
- Gateway memory: < 512MB
- Gateway CPU: < 10% average
- Database size: Monitor growth rate
- Network bandwidth: Track usage patterns

### Reliability Metrics
- Uptime target: > 99.5%
- Error rate: < 1%
- Message delivery success: > 99%
- Memory consistency: > 98%

## Troubleshooting Common Issues

### Permission Errors (Native Windows)
**Issue**: `EPERM: operation not permitted`
**Solution**: Use WSL2 instead of native Windows
```bash
wsl --install -d Ubuntu-24.04
# Follow WSL2 setup guide
```

### Gateway Connection Issues
**Issue**: Gateway not responding
**Solution**: Check health endpoint and logs
```bash
curl https://your-app.fly.dev/health
dot logs --follow
```

### Memory Search Failures
**Issue**: Memory queries returning no results
**Solution**: Verify OpenAI API configuration
```bash
dot config set agents.defaults.memorySearch.provider openai
dot config set agents.defaults.memorySearch.apiKey YOUR_KEY
```

### Channel Configuration Problems
**Issue**: Messages not routing correctly
**Solution**: Verify channel configuration
```bash
dot status --all
dot doctor
```

## User Feedback Collection

### Feedback Channels
1. **In-App Feedback**: UI-based feedback form
2. **Discord Feedback**: Dedicated feedback channel
3. **Email Feedback**: Structured feedback email
4. **Survey Feedback**: Post-testing survey

### Key Metrics to Track
1. **User Satisfaction**: 1-5 scale rating
2. **Feature Usage**: Which features are used most
3. **Performance Perception**: Response time satisfaction
4. **Error Frequency**: Types and frequency of errors
5. **Feature Requests**: Most requested new features

### Feedback Analysis
- Weekly feedback review sessions
- Categorize feedback by feature area
- Identify recurring issues and patterns
- Prioritize improvements based on feedback

## Deployment Monitoring

### Health Monitoring
```bash
# Automated health checks
*/5 * * * * curl -f https://your-app.fly.dev/health || alert.sh

# Gateway status monitoring
*/1 * * * * curl -f https://your-app.fly.dev/gateway/status || alert.sh
```

### Performance Monitoring
```bash
# Response time monitoring
watch -n 5 'curl -w "@curl-format.txt" -o /dev/null -s https://your-app.fly.dev/health'

# Resource usage monitoring
fly metrics --app dot-mvp
```

### Error Monitoring
```bash
# Log aggregation
fly logs --app dot-mvp | grep ERROR

# Automated alerting
tail -f /var/log/dot/error.log | mail -s "dot Error" admin@company.com
```

## Next Steps for MVP

1. **Deploy to Production**: Move from testing to production environment
2. **Scale Infrastructure**: Increase resources based on usage patterns
3. **Add Advanced Features**: Implement additional ClawBrain capabilities
4. **Expand Channel Support**: Add more messaging platforms
5. **Enhance UI/UX**: Improve user interface based on feedback

## Success Criteria

### Technical Success
- [ ] All core features working reliably
- [ ] Performance benchmarks met
- [ ] Error rates below thresholds
- [ ] Uptime targets achieved

### User Success
- [ ] User satisfaction > 4.0/5.0
- [ ] Feature adoption rates > 80%
- [ ] Support ticket volume < 5% of users
- [ ] Net Promoter Score > 50

## Contact Information

For MVP testing support:
- **Technical Issues**: Create GitHub issue
- **User Feedback**: Use in-app feedback or Discord
- **Emergency**: Contact development team directly
