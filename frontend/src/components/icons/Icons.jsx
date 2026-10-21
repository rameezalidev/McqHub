export function BrandLogoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="currentColor" />
      <path d="M5 13.18V17.18C5 19.94 8.13 22.18 12 22.18C15.87 22.18 19 19.94 19 17.18V13.18L12 17L5 13.18Z" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function AuthIllustration(props) {
  return (
    <svg viewBox="0 0 320 220" width="100%" height="200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="160" cy="180" rx="140" ry="24" fill="#EDE9FE" />
      <rect x="70" y="110" width="160" height="40" rx="6" fill="#8B5CF6" />
      <rect x="80" y="90" width="150" height="22" rx="4" fill="#C4B5FD" />
      <rect x="90" y="70" width="140" height="22" rx="4" fill="#A78BFA" />
      <rect x="65" y="145" width="170" height="12" rx="3" fill="#6D28D9" />
      <path d="M160 30L210 50L160 70L110 50L160 30Z" fill="#5B21B6" />
      <path d="M210 50V75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="210" cy="78" r="4" fill="#F59E0B" />
      <path d="M135 59V76C135 84 185 84 185 76V59" fill="#4C1D95" />
      <circle cx="250" cy="155" r="14" fill="#FFEDD5" />
      <path d="M250 145V155L257 159" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ErrorIcon(props) {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function EmptyHistoryIcon(props) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function NoQuestionsIcon(props) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function QuizTimerIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function AutosaveIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

export function TrophyIcon(props) {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
    </svg>
  );
}

export function StatCardIcon({ type = "default", ...props }) {
  if (type === "count") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  if (type === "accuracy") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
    </svg>
  );
}
