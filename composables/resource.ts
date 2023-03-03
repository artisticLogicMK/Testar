import gsap from 'gsap'

export const testCategories = [
    {key: 'academic', name: 'Academic Desciplines'},
    {key: 'entertainment', name: 'Entertainment'},
    {key: 'computer', name: 'Computer Programming'},
    {key: 'games', name: 'Games'},
    {key: 'history', name: 'History'},
    {key: 'information', name: 'Information'},
    {key: 'knowledge', name: 'Knowledge'},
    {key: 'language', name: 'Language'},
    {key: 'lifestyle', name: 'Lifestyle'},
    {key: 'life', name: 'Life & Philosophy'},
    {key: 'maths', name: 'Mathematics'},
    {key: 'problem', name: 'Problem Solving'},
    {key: 'science', name: 'Science & Tech'},
    {key: 'society', name: 'Society'},
    {key: 'sport', name: 'Sports'},
    {key: 'others', name: 'Others'},
]

export const env = 'prod'

export const spbStorageUrl = 'https://havyrmcezqkrsaqamtbl.supabase.co/storage/v1/object/public/testar/'

export const takeTestUrl = env === 'prod' ? 'https://testar-app.vercel.app/taketest/test-' : 'localhost:3000/taketest/test-'

export const slideInUpAnim = (el: HTMLElement, isSelf: boolean, dur: number = 1) => {
    let elType = isSelf ? el : el.children
    gsap.from(elType, {
        y: "+100",
        opacity: 0,
        delay: 0.5,
        duration: dur,
        stagger: 0.35,
        ease: "back.out(1.7)",
        clearProps: 'all'
    })
}

export const modalAnimation = () => {
    return gsap.timeline({ defaults: { ease: "power2.inOut" }})
        .to("#authOverlay", {scaleY: 0.01, x: 1, opacity: 1, display: "flex", duration: 0.4})
        .to("#authOverlay", {scaleY: 1, background: "rgba(255,255,255,0.16)", duration: 0.6})
        .to("#authOverlay #second", {scaleY: 1, opacity: 1, duration: 0.6}, "-=0.4")
        .to("#authOverlay #third", {scaleY: 1, opacity: 1, duration: 0.4}, "-=0.2")
        .to("#authOverlay #fourth", {background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.3)", duration: 0.8}, "-=0.4")
}