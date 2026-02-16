# Quick Setup - Gemini AI & PDF Export

## 🚀 Get Running in 5 Minutes

### Step 1: Install Packages (2 minutes)

```bash
cd /path/to/Wise-App-Health

# Install PDF dependencies
npm install jspdf jspdf-autotable

# Gemini is already configured! ✅
```

---

### Step 2: Verify Gemini API Key (30 seconds)

Check if your `.env` file has:
```env
GEMINI_API_KEY=your_key_here
```

If not, add it. Get a free key at: https://ai.google.dev/

---

### Step 3: Add to Results Page (2 minutes)

**Find your Results component** (probably `components/Results.tsx` or similar)

**Add these imports at the top:**
```typescript
import AIAssistant from './AIAssistant';
import { PDFPreviewCard } from './PDFExportButton';
import { getSymptomLogs } from '../services/symptomTracker';
import { getAnonymousId } from '../services/db';
```

**Add this hook to load symptom data:**
```typescript
const [symptomLogs, setSymptomLogs] = useState([]);

useEffect(() => {
  const loadSymptoms = async () => {
    const anonymousId = getAnonymousId();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const logs = await getSymptomLogs(
      anonymousId,
      thirtyDaysAgo.toISOString().split('T')[0]
    );
    setSymptomLogs(logs);
  };
  loadSymptoms();
}, []);
```

**Add components to your JSX** (after your results display):
```typescript
return (
  <div className="space-y-8">
    {/* Your existing results display */}
    
    {/* AI Assistant */}
    <AIAssistant
      analysisResult={analysisResult}
      userProfile={userProfile}
      symptomLogs={symptomLogs}
    />
    
    {/* PDF Export */}
    <PDFPreviewCard
      analysisResult={analysisResult}
      userProfile={userProfile}
    />
  </div>
);
```

---

### Step 4: Test It! (30 seconds)

1. **Start your app:**
   ```bash
   npm run dev
   ```

2. **Complete an assessment** to get results

3. **Look for:**
   - ✅ "AI Assistant" collapsible section
   - ✅ "Clinical Report Ready" card
   - ✅ "Export PDF Report" button

4. **Click AI Assistant:**
   - Should expand and show "Explain Results" tab
   - Click other tabs (Doctor Questions, Patterns, Chat)
   - Try asking a question in Chat

5. **Click Export PDF:**
   - Should show "Generating PDF..." (2-3 seconds)
   - PDF should download automatically
   - Open PDF - should see professional report

---

## ✅ You're Done!

Your WISE app now has:
- ✅ AI-powered explanations
- ✅ Doctor appointment prep
- ✅ Pattern analysis
- ✅ Interactive chat
- ✅ Professional PDF reports

---

## 🐛 Troubleshooting

### "Cannot find module 'jspdf'"
**Fix:** Run `npm install jspdf jspdf-autotable`

### "API key not configured"
**Fix:** Add `GEMINI_API_KEY=your_key` to `.env` file

### "AI Assistant not showing"
**Fix:** Make sure you passed `analysisResult` and `userProfile` props

### "PDF won't download"
**Fix:** 
1. Check browser console for errors
2. Make sure jsPDF is installed
3. Try different browser (Chrome works best)

### "AI returns empty responses"
**Fix:**
1. Check Gemini API key is valid
2. Check internet connection
3. Check browser console for API errors

---

## 📱 Test on Different Devices

### Desktop
- ✅ AI Assistant expands properly
- ✅ Tabs work smoothly
- ✅ PDF downloads correctly

### Mobile
- ✅ AI Assistant responsive
- ✅ Buttons touch-friendly
- ✅ PDF can be saved/shared

### Tablet
- ✅ Layout looks good
- ✅ All features accessible

---

## 🎯 What to Show Users

### Demo Flow:

1. **Complete Assessment**
   - Fill out survey
   - Get results

2. **Show AI Assistant**
   - "This explains what your results mean in simple terms"
   - Click through tabs
   - Ask a question in chat

3. **Show PDF Export**
   - "Download this to bring to your doctor"
   - Click export
   - Show the generated PDF
   - Point out: assessment, symptoms, questions

4. **Highlight Value**
   - "AI makes medical info understandable"
   - "PDF helps you communicate with your doctor"
   - "All your data in one professional report"

---

## 🚀 Next Steps

### Immediate (Test Today):
1. ✅ Install packages
2. ✅ Add components
3. ✅ Test AI features
4. ✅ Generate test PDF

### Short-term (This Week):
1. Customize AI personality (optional)
2. Add email-to-doctor feature
3. Test with real users
4. Collect feedback

### Medium-term (Next 2 Weeks):
1. Add more AI use cases
2. Enhance PDF design
3. Add print functionality
4. Mobile optimization

---

**Time to Complete:** ~5 minutes  
**Difficulty:** ⭐ Easy (if you follow steps)  
**Dependencies:** jsPDF, Gemini API key

**Status:** ✅ Ready to Use!

🎉 **Enjoy your AI-powered clinical assistant!**
