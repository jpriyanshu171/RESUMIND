import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (path: string, data: string | File | Blob) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<Object>;
        img2txt: (image: string | File | Blob, testMode?: boolean) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;
  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };
  fs: { write: any; read: any; upload: any; delete: any; readDir: any };
  ai: { chat: any; feedback: any; img2txt: any };
  kv: { get: any; set: any; delete: any; list: any; flush: any };
  init: () => void;
  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) => {
    set({ error: msg, isLoading: false });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available"), false;

    set({ isLoading: true, error: null });
    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        set({
          auth: { ...get().auth, user, isAuthenticated: true },
          isLoading: false,
        });
        return true;
      } else {
        set({
          auth: { ...get().auth, user: null, isAuthenticated: false },
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check auth");
      return false;
    }
  };

  const signIn = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");

    set({ isLoading: true, error: null });
    try {
      await puter.auth.signIn(); // triggers login prompt
      const user = await puter.auth.getUser();
      set({ auth: { ...get().auth, user, isAuthenticated: true }, isLoading: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      set({ isLoading: false });
    }
  };

  const signOut = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");

    set({ isLoading: true, error: null });
    try {
      await puter.auth.signOut();
      set({ auth: { ...get().auth, user: null, isAuthenticated: false }, isLoading: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      set({ isLoading: false });
    }
  };

  const refreshUser = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) return setError("Puter.js not available");

    set({ isLoading: true, error: null });
    try {
      const user = await puter.auth.getUser();
      set({ auth: { ...get().auth, user, isAuthenticated: true }, isLoading: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh user");
      set({ isLoading: false });
    }
  };

  const init = (): void => {
    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) setError("Puter.js failed to load within 10 seconds");
    }, 10000);
  };

  // FS, AI, KV remain same...
  return {
    isLoading: false, // ✅ start false
    error: null,
    puterReady: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write: (path: string, data: any) => getPuter()?.fs.write(path, data),
      read: (path: string) => getPuter()?.fs.read(path),
      readDir: (path: string) => getPuter()?.fs.readdir(path),
      upload: (files: any) => getPuter()?.fs.upload(files),
      delete: (path: string) => getPuter()?.fs.delete(path),
    },
    ai: {
      chat: (prompt: any, imageURL?: any, testMode?: any, options?: any) =>
        getPuter()?.ai.chat(prompt, imageURL, testMode, options),
      feedback: (path: string, message: string) =>
        getPuter()?.ai.chat([{ role: "user", content: [{ type: "file", puter_path: path }, { type: "text", text: message }] }], { model: "claude-3-7-sonnet" }),
      img2txt: (image: any, testMode?: boolean) => getPuter()?.ai.img2txt(image, testMode),
    },
    kv: {
      get: (key: string) => getPuter()?.kv.get(key),
      set: (key: string, value: string) => getPuter()?.kv.set(key, value),
      delete: (key: string) => getPuter()?.kv.delete(key),
      list: (pattern: string, returnValues?: boolean) => getPuter()?.kv.list(pattern, returnValues),
      flush: () => getPuter()?.kv.flush(),
    },
    init,
    clearError: () => set({ error: null }),
  };
});
