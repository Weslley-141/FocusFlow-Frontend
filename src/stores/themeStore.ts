import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

function apply(dark: boolean) {
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', dark);
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      apply(next);
      return { isDark: next };
    }),
  setDark: (dark) => {
    apply(dark);
    set({ isDark: dark });
  },
}));
