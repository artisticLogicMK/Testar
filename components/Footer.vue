<template>
    <div class="absolute bottom-0 w-full mb-2">
        <div class="w-full max-w-5xl mx-auto flex justify-between items-center px-3 text-dark-200 font-bold text-sm text-start">
            <span>&copy;{{new Date().getFullYear()}} Testar.</span>

            <a
                v-if="useRoute().path == '/' || useRoute().path.includes('/dashboard')"
                href="https://www.producthunt.com/posts/testar?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-testar" target="_blank"
            >
                <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=374605&theme=neutral" alt="Testar - Create&#0032;tests&#0032;and&#0032;quizess&#0032;easily&#0032;&#0091;beta&#0093;&#0046; | Product Hunt" class="w-36 sm:w-44"  />
            </a>
        </div>
    </div>
</template>