# InnoVoice Mobile App - Diagrams & Flowcharts

This directory contains comprehensive diagrams and flowcharts documenting the InnoVoice mobile app architecture, user flows, and features.

## 📊 Available Diagrams

### 1. **App Ecosystem** (`01-app-ecosystem.mmd`)
**Purpose:** High-level system architecture overview  
**Shows:**
- Mobile app layers (UI, Context, Service)
- External services (Backend API, MongoDB, Cloudinary, AI services)
- Network layer (NetInfo, Axios)
- Device features (Camera, Haptics, Clipboard, Localization)
- Data flow between components

**Use this to understand:** How the entire system fits together

---

### 2. **User Journey Overview** (`02-user-journey-overview.mmd`)
**Purpose:** Complete end-to-end user experience  
**Shows:**
- First-time vs returning user flow
- Onboarding process
- Main tab navigation (Home, Track, Settings)
- High-level feature access
- Continuous monitoring (network, offline indicator)

**Use this to understand:** The complete user experience from app launch to report resolution

---

### 3. **Report Submission Feature** (`03-feature-submission-flow.mmd`)
**Purpose:** Detailed submission process  
**Shows:**
- Step-by-step form completion (Category → Details → Photo → Review)
- Anonymous vs identified reporting
- Form validation
- Online submission with AI analysis
- Offline draft saving
- Success modal and tracking code

**Use this to understand:** How users submit reports and what happens behind the scenes

---

### 4. **Report Tracking Feature** (`04-feature-tracking-flow.mmd`)
**Purpose:** Detailed tracking process  
**Shows:**
- Saved tracking codes list
- Manual search vs auto-search
- Code deletion with confirmation
- API tracking request
- Report details display (status, priority, history)
- Pull-to-refresh functionality
- Back navigation to saved codes

**Use this to understand:** How users track their submitted reports

---

### 5. **Settings & Draft Management** (`05-feature-settings-drafts.mmd`)
**Purpose:** Settings and draft management flows  
**Shows:**
- Language selection (English, Tagalog, Bisaya)
- Draft count display
- View drafts modal
- Draft actions (Edit, Submit, Delete)
- Clear all drafts with confirmation
- Privacy policy and terms of use modals

**Use this to understand:** How users manage app settings and saved drafts

---

### 6. **Data Flow Architecture** (`06-data-flow-architecture.mmd`)
**Purpose:** Technical data flow through app layers  
**Shows:**
- Presentation layer (Screens, Components)
- State management layer (Contexts)
- Service layer (API, Draft, Storage, Image services)
- External APIs and storage
- Data flow direction and dependencies

**Use this to understand:** Technical architecture and how data moves through the app

---

### 7. **Offline/Online Behavior** (`07-offline-online-sync.mmd`)
**Purpose:** Network connectivity handling  
**Shows:**
- Network status monitoring
- Online mode features (submit, track, refresh)
- Offline mode limitations
- Draft-only functionality when offline
- Network change detection and user notifications
- Data persistence strategy

**Use this to understand:** How the app handles connectivity changes and offline scenarios

---

### 8. **Product Roadmap Timeline** (`08-product-roadmap-timeline.mmd`)
**Purpose:** Feature development timeline  
**Shows:**
- Current features (Phase 1)
- Planned features (Phase 2-4)
- Timeline and milestones

**Use this to understand:** Project roadmap and future features

---

### 9. **Feature Priority Matrix** (`09-feature-priority-matrix.mmd`)
**Purpose:** Feature prioritization  
**Shows:**
- Feature importance vs effort
- Priority quadrants

**Use this to understand:** Which features to build first

---

### 10. **Complete Project Structure** (`10-complete-project-structure.mmd`)
**Purpose:** Complete file and folder structure  
**Shows:**
- All directories and their contents
- Configuration files
- Component organization
- Service layer structure
- Context providers
- Data flow to external services

**Use this to understand:** The entire codebase structure and how folders are organized

---

### 11. **File Connections Map** (`11-file-connections-map.mmd`)
**Purpose:** How files connect and communicate  
**Shows:**
- UI Layer → Component Layer → Context Layer → Service Layer → Data Layer
- Component dependencies
- Service interactions
- Context usage across components
- Style and utility connections

**Use this to understand:** How different files interact and depend on each other

---

### 12. **Folder Hierarchy** (`12-folder-hierarchy.mmd`)
**Purpose:** Detailed folder organization  
**Shows:**
- Complete folder tree structure
- All files in each directory
- File purposes and descriptions
- Asset organization
- Documentation structure

**Use this to understand:** Where to find specific files and how the project is organized

---

## 🎨 How to View These Diagrams

### Option 1: Mermaid Live Editor (Recommended)
1. Go to https://mermaid.live/
2. Copy the content of any `.mmd` file
3. Paste into the editor
4. View the rendered diagram

### Option 2: VS Code Extension
1. Install "Markdown Preview Mermaid Support" extension
2. Open any `.mmd` file
3. Use preview to see the diagram

### Option 3: GitHub
- GitHub automatically renders Mermaid diagrams in markdown files
- View them directly in the repository

---

## 🎯 Quick Reference Guide

**Want to understand...**

| Topic | Diagram to Check |
|-------|------------------|
| Overall system architecture | `01-app-ecosystem.mmd` |
| User experience flow | `02-user-journey-overview.mmd` |
| How to submit a report | `03-feature-submission-flow.mmd` |
| How to track a report | `04-feature-tracking-flow.mmd` |
| Settings and drafts | `05-feature-settings-drafts.mmd` |
| Technical data flow | `06-data-flow-architecture.mmd` |
| Offline functionality | `07-offline-online-sync.mmd` |
| Product roadmap | `08-product-roadmap-timeline.mmd` |
| Feature priorities | `09-feature-priority-matrix.mmd` |
| Complete project structure | `10-complete-project-structure.mmd` |
| How files connect | `11-file-connections-map.mmd` |
| Folder organization | `12-folder-hierarchy.mmd` |

---

## 📝 Diagram Conventions

### Colors Used:
- 🟢 **Green** - Start/End points, Success states
- 🟠 **Orange** - Decision points, Choices
- 🔵 **Blue** - Process steps, Actions
- 🔴 **Red** - Errors, Offline states
- 🟣 **Purple** - Storage operations
- 🔷 **Cyan** - Display/UI elements, Modals

### Icons Used:
- 📱 Mobile app/screens
- 🌐 API/Network
- 💾 Storage/Save
- 🔍 Search/Track
- ⚙️ Settings
- 📝 Form/Input
- ✅ Success
- ❌ Error
- 🔴 Offline
- 📡 Network monitoring
- 🤖 AI processing
- 📷 Camera/Photo
- 🗑️ Delete
- ✏️ Edit

---

## 🔄 Keeping Diagrams Updated

When making changes to the app:
1. Update the relevant diagram(s)
2. Add a note in the diagram's frontmatter about what changed
3. Update this README if new diagrams are added

---

## 📚 Related Documentation

- **AGENTS.md** - Project overview and build commands
- **AI_CONTEXT_PROMPT.md** - AI assistant context
- **app.json** - App configuration
- **package.json** - Dependencies

---

**Last Updated:** December 2024  
**Maintained By:** Development Team  
**Questions?** Refer to AGENTS.md for project contacts
