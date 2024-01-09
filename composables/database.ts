import {v4 as uuidv4} from 'uuid'

export const createTest = async () => {
    const supabase = useSupabaseClient()
    const user = useUser()

    const { data, error } = await supabase.from('tests')
        .insert({
            user_id: user.value.id,
            uuid: uuidv4(),
            title: 'Untitled test',
            link: uuidv4(),
            updated_at: new Date().toJSON()
        })
        .select().single()

    if (data && !error) {
        navigateTo('/dashboard/test-'+data.uuid)
    }     
}

// pagination algorythm by https:// github.com/silentworks
export const getPagination = (page:number, size:number) => {
    const limit = size ? +size : 3
    const from = page ? page * limit : 0
    const to = page ? from + size - 1 : size - 1

    return { from, to }
}

export const copyTestLink = (link: string) => {
    navigator.clipboard.writeText(takeTestUrl+link)
    return true
}