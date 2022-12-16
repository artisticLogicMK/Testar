import {v4 as uuidv4} from 'uuid'

export const createTest = async () => {
    const supabase = useSupabaseClient()
    const user = useUser()

    const { data, error } = await supabase
        .from('tests')
        .insert({ user_id: user.value.id, title: 'Untitled test', link: '/taketest/test-'+uuidv4() })
        .select()
        .single()

    if (data && !error) {
        navigateTo('/dashboard/test-'+data.id)
    }     
}


export const toggleTestBools = async (testId: number, type: string, state: boolean) => {
    const supabase = useSupabaseClient()
    const user = useUser()

    //define type
    let arg
    if (type === 'starred') { arg = {starred: state ? false : true} }

    const { data, error } = await supabase
        .from('tests')
        .update(arg)
        .eq('id', testId)
        .eq('user_id', user.value.id)
        .select()

    if (data) {
        return true
    }
}

export const deleteTest = async (testId: number) => {
    const supabase = useSupabaseClient()
    const user = useUser()

    
}