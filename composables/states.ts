export const useUser = () => useState<any>('useUser', () => useSupabaseUser() )

export const useClient = () => useState<any>('useClient', () => useSupabaseClient() )

export const store = createGlobalState(
    () => {
      // states
      const questionCount = ref()

      const alert = ref(false)
      const alertData = ref({ type: null, msg: null })
  
      return { questionCount, alert, alertData }
    }
)