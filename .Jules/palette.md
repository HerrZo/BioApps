## 2026-04-11 - Empty States Pattern in Filters
**Learning:** When users apply a filter that results in an empty grid, showing a static 'No items found' message is a UX dead end. In this app's main dashboard, clicking an empty category like 'NUT5' left users stuck without a clear path forward.
**Action:** Implemented a reusable pattern for empty states that includes an icon, a descriptive message, and an actionable 'Reset filter' button. This pattern should be applied across other filtered lists in the app.
