import { signInAnonymously } from 'firebase/auth';
import { auth } from './config';

export async function ensureAuth(): Promise<void> {
  if (!auth || auth.currentUser) return;
  await signInAnonymously(auth);
}
