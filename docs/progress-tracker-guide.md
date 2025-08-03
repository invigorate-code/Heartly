# Progress Tracker Quick Reference Guide

## 🚀 Quick Commands

### **View Progress**
```bash
# Direct execution
./scripts/dev-progress.sh

# Commit with progress (recommended)
./scripts/commit-with-progress.sh "Your commit message"

# Git alias for commit with progress
git commit-progress "Your commit message"

# Traditional git (progress in separate commit)
git commit -m "Your commit message"
```

### **Auto-Generated Summary**
```bash
# View current progress summary (auto-updated)
cat docs/current-progress.md

# Check when it was last updated
ls -la docs/current-progress.md

# Note: Progress file is automatically staged for commit
```

### **Debug & Test**
```bash
# Terminal detection debug
DEBUG_COLORS=true ./scripts/dev-progress.sh

# Test different terminal types
./scripts/test-terminal-detection.sh

# Force terminal type
TERM=xterm ./scripts/dev-progress.sh
```

## 📊 Current Metrics

### **Story Progress**
- **Overall**: 1/50 stories (2%)
- **Epic 1**: 1/17 stories (5%)
- **Epic 2**: 0/15 stories (0%)
- **Epic 3**: 0/18 stories (0%)

### **Team Progress**
- **Team A**: 0/7 stories (Core Infrastructure)
- **Team B**: 0/10 stories (User Experience)

### **Technical Progress**
- **Backend**: 41%
- **Frontend**: 64%
- **HIPAA Compliance**: 62%
- **Overall Project**: 43%

## 🧪 Testing Progress Updates

### **Add Team A Stories**
```bash
mkdir -p ai-workflow/ai-development-track/ai-dev-notes/feature-epic-1-story-1-1-create-core-database-migrations
mkdir -p ai-workflow/ai-development-track/ai-dev-notes/feature-epic-1-story-1-3-add-database-indexes
./scripts/dev-progress.sh
```

### **Add Team B Stories**
```bash
mkdir -p ai-workflow/ai-development-track/ai-dev-notes/feature-epic-1-story-1-2-implement-rls-policies
mkdir -p ai-workflow/ai-development-track/ai-dev-notes/feature-epic-1-story-1-4-implement-database-constraints
./scripts/dev-progress.sh
```

## 🔧 Troubleshooting

### **Color Issues**
```bash
# Check terminal type
echo $TERM

# Test color support
tput colors

# Force no color
TERM=dumb ./scripts/dev-progress.sh
```

### **Script Not Found**
```bash
# Check if script exists
ls -la scripts/dev-progress.sh

# Make executable
chmod +x scripts/dev-progress.sh
```

### **Pre-Push Hook Issues**
```bash
# Check hook exists
ls -la .git/hooks/pre-push

# Make executable
chmod +x .git/hooks/pre-push

# Test hook
.git/hooks/pre-push
```

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG_COLORS` | Show terminal detection info | `DEBUG_COLORS=true ./scripts/dev-progress.sh` |
| `TERM` | Override terminal type | `TERM=xterm ./scripts/dev-progress.sh` |

## 🎯 Best Practices

### **✅ Daily Usage**
1. **Morning**: `./scripts/dev-progress.sh` - Check current status
2. **Before Commits**: `git push --dry-run` - Validate progress
3. **Team Meetings**: Run script to show status
4. **Planning**: Track story completion

### **✅ Terminal Tips**
- Use pre-push hook for best visual experience
- Script auto-detects terminal capabilities
- Progress bars work regardless of color support
- Debug mode available for troubleshooting

## 📊 Metrics Explained

### **Story Progress**
- Counts completed story folders in `ai-dev-notes/`
- Tracks progress across 3 epics
- Shows parallel team progress

### **Technical Metrics**
- **Backend**: API modules, tests, docs, migrations
- **Frontend**: Components, pages, tests
- **HIPAA**: Audit logs, guards, validation, security

### **Healthcare Features**
- **Entities**: Client, Facility, User, Tenant
- **Components**: Dashboard, Auth, Onboarding
- **Security**: RLS policies, audit logging

## 🔍 How It Works

### **File Discovery**
```bash
# Stories
find ai-workflow/ai-development-track/ai-dev-notes -name "feature-epic-*-story-*" -type d

# Backend
find heartly-backend/src/api -name "*.module.ts"
find heartly-backend/src/common/entities -name "*.ts"

# Frontend
find heartly-frontend/components -name "*.tsx"
find heartly-frontend/app -name "*.tsx"
```

### **Terminal Detection**
```bash
# Check terminal type
echo $TERM

# Check color support
tput colors

# Check if interactive
[ -t 1 ] && echo "Interactive" || echo "Non-interactive"
```

## 📚 Related Files

- **Main Script**: `scripts/dev-progress.sh`
- **Test Script**: `scripts/test-terminal-detection.sh`
- **Pre-Push Hook**: `.git/hooks/pre-push`
- **Documentation**: `docs/pre-push-hook.md`

## 🆘 Common Issues

### **Raw Color Codes Visible**
- **Cause**: Terminal not interpreting escape sequences
- **Solution**: Use `echo -e` or pre-push hook

### **Script Permission Denied**
- **Cause**: Script not executable
- **Solution**: `chmod +x scripts/dev-progress.sh`

### **No Progress Bars**
- **Cause**: Terminal doesn't support Unicode
- **Solution**: Script falls back to plain text

### **Wrong Terminal Type**
- **Cause**: TERM variable incorrect
- **Solution**: Set `TERM=xterm-256color` or use debug mode

---

**💡 Tip**: The pre-push hook provides the best visual experience and automatically runs before git pushes! 