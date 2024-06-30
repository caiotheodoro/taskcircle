# About the Application

Task Circle is a task management application that allows users to create, manage and collaborate on tasks within an group.

## Application Schema and Processes

#### Entity-Relationship Diagram (ERD)

The following ERD illustrates the relationships between different entities in the application:

```mermaid
erDiagram
  USERS  {
    id UUID
    name TEXT
    email TEXT
    emailVerified TIMESTAMP
    organization_id UUID
    image TEXT
  }

  ORGANIZATION {
    id UUID
    name TEXT
    slug TEXT
    description TEXT
    otp TEXT
  }

  USER_ORGANIZATIONS {
    id UUID
    user_id UUID
    organization_id UUID
    role TEXT
  }

  POSTS {
    id UUID
    content TEXT
    timestamp TIMESTAMP
    status BOOLEAN
    organization_id UUID
    updatedBy UUID
    user_id UUID
  }

  ACCOUNTS {
    userId UUID
    type TEXT
    provider TEXT
    providerAccountId TEXT
    refresh_token TEXT
    access_token TEXT
    expires_at INTEGER
    token_type TEXT
    scope TEXT
    id_token TEXT
    session_state TEXT
  }

  ORGANIZATION_INVITES {
    id UUID
    user_id UUID
    organization_id UUID
    status TEXT
    expires_at TIMESTAMP
  }

  USERS ||--o{ POSTS : "creates"
  USERS ||--o{ USER_ORGANIZATIONS : "belongs to"
  USERS ||--o{ ORGANIZATION_INVITES : "receives"
  USERS ||--o{ ACCOUNTS : "has"
  ORGANIZATION ||--o{ POSTS : "contains"
  ORGANIZATION ||--o{ USER_ORGANIZATIONS : "has"
  ORGANIZATION ||--o{ ORGANIZATION_INVITES : "issues"
  POSTS }o--|| USERS : "authored by"
  POSTS }o--|| ORGANIZATION : "in"
  USER_ORGANIZATIONS }o--|| USERS : "for"
  USER_ORGANIZATIONS }o--|| ORGANIZATION : "in"
  ORGANIZATION_INVITES }o--|| USERS : "for"
  ORGANIZATION_INVITES }o--|| ORGANIZATION : "to"
  ACCOUNTS }o--|| USERS : "belongs to"
```

#### Cron Job Sequence Diagram

The following sequence diagram describes the cron job responsible for cleaning up expired organization invites:

```mermaid
sequenceDiagram
    participant CronJob
    participant Database

    CronJob->>Database: Schedule 'organization-invites-daily-cleanup'
    Note right of CronJob: Runs daily at midnight (GMT)
    CronJob->>Database: Check and clears for invites older than 24 hours
    Database-->>CronJob: Confirm deletion
    Note right of Database: Invites older than 24 hours are deleted
```
