export const useUser = () => useState<object>('useUser', () => useSupabaseUser() )

export const useClient = () => useState<object>('useClient', () => useSupabaseClient() )