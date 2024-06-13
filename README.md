```mermaid
erDiagram
    AUTH_USER {
        UUID id
        TEXT email
        TEXT picture
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    ORGANIZATION {
        UUID id
        TEXT name
        TEXT description
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    AUTH_USER || --o{ ORGANIZATION : "owns"
    AUTH_USER || --o{ ORGANIZATION : "member_of"
    ```
