import { localRepo } from './localRepo'
import type { UserDataRepo } from './repo'

/** Domani: supabaseRepo al posto di localRepo. */
export const repo: UserDataRepo = localRepo
export type { UserDataRepo, Settings } from './repo'
