# Backend Team - Chatbot API Requirements

> **Project**: Eduera LMS - AI Chatbot Persistence
> **Requester**: Frontend Team
> **Date**: May 2026
> **Priority**: High

---

## Overview

To fully implement AI chatbot conversation persistence and full functionality across Student, Professor, and Admin roles, we need the following API endpoints.

---

## Current State vs Needed

### Student Chat

| Feature | Current API | Status |
|---------|-------------|--------|
| Send message | `POST /api/student/chat/` | ✅ Working |
| Get chat history | `GET /api/student/chat/` | ⚠️ Returns only MOST RECENT conversation |
| List ALL conversations | N/A | ❌ Missing |
| Get messages by conversation_id | N/A | ❌ Missing |
| Create new conversation | N/A | ❌ Missing |
| Delete conversation | N/A | ❌ Missing |

### Instructor Chat

| Feature | Current API | Status |
|---------|-------------|--------|
| List student conversations | `GET /api/professor/chat/` | ✅ Working |
| Get student messages | `GET /api/professor/chat/messages/` | ✅ Working |
| Own AI assistant (send message) | N/A | ❌ Missing |
| List own AI conversations | N/A | ❌ Missing |
| Delete conversation | N/A | ❌ Missing |

---

## Required Endpoints

### 1. Student - List All Conversations

**Endpoint:**
```
GET /api/student/conversations/
```

**Purpose:** Populate sidebar with all past conversations.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "What is backpropagation?",
    "created_at": "2024-11-19T10:00:00Z",
    "updated_at": "2024-11-19T10:05:00Z",
    "last_message_preview": "It's the central mechanism by which..."
  },
  {
    "id": 2,
    "title": "Explain neural networks",
    "created_at": "2024-11-18T14:30:00Z",
    "updated_at": "2024-11-18T14:45:00Z",
    "last_message_preview": "Neural networks are computing systems..."
  }
]
```

---

### 2. Student - Get Messages for Specific Conversation

**Endpoint:**
```
GET /api/student/chat/messages/?conversation_id=<id>
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `conversation_id` | int | Yes | ID of the conversation |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "conversation": 1,
    "role": "USER",
    "content": "What is backpropagation?",
    "timestamp": "2024-11-19T10:00:00Z"
  },
  {
    "id": 2,
    "conversation": 1,
    "role": "ASSISTANT",
    "content": "Backpropagation is the central mechanism by which neural networks learn...",
    "sources_used": [
      {"title": "Lecture 5: Deep Learning", "page": 12},
      {"title": "ML_Basics.pdf", "page": 4}
    ],
    "was_from_rag": true,
    "timestamp": "2024-11-19T10:00:05Z"
  },
  {
    "id": 3,
    "conversation": 1,
    "role": "USER",
    "content": "Explain more simply",
    "timestamp": "2024-11-19T10:01:00Z"
  },
  {
    "id": 4,
    "conversation": 1,
    "role": "ASSISTANT",
    "content": "Think of backpropagation as the way a teacher corrects a student's mistakes...",
    "sources_used": [],
    "was_from_rag": false,
    "timestamp": "2024-11-19T10:01:03Z"
  }
]
```

---

### 3. Student - Create New Conversation

**Endpoint:**
```
POST /api/student/conversations/
```

**Request Body:**
```json
{
  "title": "What is backpropagation?"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "What is backpropagation?",
  "created_at": "2024-11-19T10:00:00Z"
}
```

---

### 4. Student - Delete Conversation

**Endpoint:**
```
DELETE /api/student/conversations/<id>/
```

**Response:** `204 No Content`

---

### 5. Professor - Send Message to AI Assistant (NEW!)

Currently professors can only view student conversations. They need their own AI assistant.

**Endpoint:**
```
POST /api/professor/chat/
```

**Request Body:**
```json
{
  "content": "Create a quiz about sorting algorithms",
  "course_id": 5
}
```

**Response (200 OK):**
```json
{
  "conversation_id": 45,
  "user_message": {
    "id": 101,
    "role": "USER",
    "content": "Create a quiz about sorting algorithms",
    "timestamp": "2024-11-19T10:00:00Z"
  },
  "ai_message": {
    "id": 102,
    "role": "ASSISTANT",
    "content": "Here's a quiz about sorting algorithms...",
    "sources_used": [],
    "was_from_rag": false,
    "timestamp": "2024-11-19T10:00:05Z"
  }
}
```

---

### 6. Professor - List Own AI Conversations

**Endpoint:**
```
GET /api/professor/conversations/
```

**Response:**
```json
[
  {
    "id": 45,
    "title": "Create a quiz about sorting",
    "created_at": "2024-11-19T10:00:00Z",
    "updated_at": "2024-11-19T10:05:00Z",
    "last_message_preview": "Here's a quiz about sorting algorithms..."
  }
]
```

---

### 7. Professor - Get AI Conversation Messages

**Endpoint:**
```
GET /api/professor/chat/messages/?conversation_id=<id>
```

**Response:** Same structure as student messages.

---

### 8. Professor - Delete Conversation

**Endpoint:**
```
DELETE /api/professor/conversations/<id>/
```

**Response:** `204 No Content`

---

### 9. TA Chat (Optional)

TA users may need similar endpoints. If so, replicate professor endpoints for `/api/ta/`.

---

## Summary Table

| Role | Endpoint | Method | Purpose |
|------|----------|--------|---------|
| Student | `/api/student/conversations/` | GET | List all conversations for sidebar |
| Student | `/api/student/chat/messages/` | GET | Get messages by conversation_id |
| Student | `/api/student/conversations/` | POST | Create new conversation |
| Student | `/api/student/conversations/<id>/` | DELETE | Delete conversation |
| Professor | `/api/professor/chat/` | POST | Send message to AI (NEW!) |
| Professor | `/api/professor/conversations/` | GET | List own AI conversations |
| Professor | `/api/professor/chat/messages/` | GET | Get own AI messages |
| Professor | `/api/professor/conversations/` | POST | Create new AI conversation |
| Professor | `/api/professor/conversations/<id>/` | DELETE | Delete conversation |

---

## Implementation Priority

### Phase 1 (Critical - Must Have)
1. `GET /api/student/conversations/` - List all conversations
2. `GET /api/student/chat/messages/?conversation_id=X` - Get messages
3. `POST /api/professor/chat/` - Professors need own AI assistant

### Phase 2 (Important)
4. Create/delete conversation endpoints
5. Title update endpoint (PATCH)

### Phase 3 (Nice to Have)
6. Star/favorite conversations
7. Archive conversations

---

## Notes

- For `sources_used`, include `page` number when available from PDF/document
- For `was_from_rag`: `true` if answer came from course materials, `false` if general knowledge
- Keep conversation context for at least 30 days
- Consider pagination for users with many conversations (50+)

---

## Questions?

If any endpoint needs clarification or if there are existing endpoints we should use instead, please reach out!

**Frontend Contact:** [Your Name]