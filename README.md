# Reading Tracker

A personal reading tracker built with React, Vite, TypeScript, and Tailwind CSS for CSCI 39548 Assignment 3.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- Search books via the Open Library API (no API key required)
- Add books to your library with a default status of "To Read"
- Move books through the reading pipeline: To Read → Reading → Finished
- Rate finished books 1–5 stars
- Filter library by status and sort by title, author, or date added
- Stats bar showing counts and average rating
- Dark mode toggle, persisted across page reloads
- Library survives page refresh via localStorage

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (Vite plugin)
- Open Library Search API

## Project Structure

```
src/
  types.ts                  # Shared TypeScript interfaces
  useLibrary.ts             # useReducer hook + localStorage persistence
  App.tsx                   # Root component, dark mode, layout
  components/
    SearchBar.tsx           # Debounced search, loading state, error handling
    BookCard.tsx            # Book display, status pipeline, star rating
    StatsBar.tsx            # Reactive counts and average rating
    LibraryControls.tsx     # Filter pills and sort controls
```