// Simple encryption/decryption for localStorage
// Note: This is client-side encryption for basic obfuscation, not security-grade encryption

const ENCRYPTION_KEY = "sm-app-secret-key-2024"; // In production, use env variable

function getKey(): string {
  // Generate a key from the encryption key and a salt
  return ENCRYPTION_KEY;
}

function simpleEncrypt(text: string): string {
  try {
    let result = "";
    const key = getKey();
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    // Base64 encode for safe storage
    return btoa(result);
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Fallback to plain text if encryption fails
  }
}

function simpleDecrypt(encryptedText: string): string {
  try {
    // Base64 decode first
    const decoded = atob(encryptedText);
    let result = "";
    const key = getKey();
    for (let i = 0; i < decoded.length; i++) {
      const char = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    return result;
  } catch (error) {
    console.error("Decryption error:", error);
    // Try to return as plain text (for backward compatibility)
    try {
      return JSON.parse(encryptedText);
    } catch {
      return encryptedText;
    }
  }
}

export const storage = {
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      const encrypted = simpleEncrypt(value);
      window.localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Storage setItem error:", error);
      // Fallback to plain storage
      window.localStorage.setItem(key, value);
    }
  },

  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      const encrypted = window.localStorage.getItem(key);
      if (!encrypted) return null;
      
      // Try to decrypt
      const decrypted = simpleDecrypt(encrypted);
      return decrypted;
    } catch (error) {
      console.error("Storage getItem error:", error);
      // Fallback to plain retrieval
      return window.localStorage.getItem(key);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  },
};

