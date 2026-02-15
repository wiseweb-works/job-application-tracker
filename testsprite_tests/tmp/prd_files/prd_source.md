# Job Application Tracker - PRD

## Overview
A web application to track and manage job applications. Users can add new applications, update their status, filter through them, and delete them.

## Target Audience
Job seekers looking for an organized way to manage their application pipeline.

## Features

### 1. Dashboard / Application List
- View all job applications in a responsive grid.
- Each application shows Company Name, Job Title, Status, Location, Salary Range, and Application Date.

### 2. Add / Edit Application
- Form to input job details.
- Required fields: Company Name, Job Title, Status, Location, Application Date.
- Optional fields: Salary Range, Notes.

### 3. Application Filtering
- Filter applications by company name or job title using a search bar.
- Filter by application status (e.g., APPLIED, INTERVIEWING, OFFER, REJECTED).

### 4. Delete Application
- Remove applications from the tracker.

## Technical Requirements
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, Shadcn UI.
- Backend: Next.js Server Actions.
- Database: SQLite with Prisma ORM.
- Validation: Zod schema validation for inputs.

## User Flows
- User opens the app and is redirected to `/applications`.
- User clicks "Add Application", fills the form, and submits.
- User sees the new application in the list.
- User updates the status of an existing application.
- User deletes an application.
