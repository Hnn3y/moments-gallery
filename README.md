```mermaid
flowchart TD
  %% Entry Point
 A[User Clicks Link] --> B[Upload Page]
  B --> C[User Uploads Image/Video + Poster Name + Caption]
  C --> D[Upload Stored in DB as Pending]
  D --> E[Redirect to Gallery Page]
  E --> F[Show Only Approved Media]

  %% Admin Moderation Flow
  D --> G[Admin Dashboard]
  G --> H[Review Uploaded Media]
  H --> I{Approve or Reject?}
  I -->|Approve| J[Media Status: Approved]
  I -->|Reject| K[Media Removed]
  J --> F

  %% Gallery Interaction
  F --> L[Animated Display of Media Grid]
  L --> M[User Views Media Details]
  M --> N[Users Can Add Comments]
  N --> O[Other Users Can See Comments]

  %% Tools and Design
  subgraph Tech_Stack [Built With]
    T1[MUI]
    T2[Tailwind CSS]
    T3[Framer Motion for Animations]
    T4[Supabase or Cloudinary for Media Storage]
    T5[React + Vite + React Router]
  end

  A --> T1
  A --> T2
  L --> T3
  C --> T4
  A --> T5
