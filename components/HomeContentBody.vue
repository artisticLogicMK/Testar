<template>
    <div class="mb-5">

        <img src="~/assets/img/home-asset1.png" class="w-full">
        

        <div class="bg-white px-3 sm:px-6 md2:px-6">
            <div class="max-w-5xl mx-auto py-10">

                <div>
                    <div id="features" class="group">
                        <div class="cont">
                            <div class="icon">
                                <IconsDashboard :color="'fill-cyan-700'" :size="20" />
                            </div>
                            <p class="title">User-Friendly Dashboard</p>
                            <p class="descri">Testar has a simple and intuitive dashboard and a clean, organized user interface, making it easy for users to create and administer tests without technical skills.</p>
                        </div>
                        
                        <img src="~/assets/img/feature_shots/dashboard.png">
                    </div>

                    <div id="features">
                        <div class="cont">
                            <div class="icon">
                                <IconsSettings :color="'fill-cyan-700'" :size="20" />
                            </div>
                            <p class="title">Customizable Settings</p>
                            <p class="descri">Testar allows users to customize their tests, including time limits, availability period, data collection, and other settings. This level of customization enables users to tailor their tests to their specific needs and create a more effective testing experience.</p>
                        </div>
                        
                        <img src="~/assets/img/feature_shots/customize.png">
                    </div>

                    <div id="features">
                        <div class="cont">
                            <div class="icon">
                                <IconsShareCircle :color="'fill-cyan-700'" :size="20" />
                            </div>
                            <p class="title">Test Sharing</p>
                            <p class="descri">Testar makes it easy to share tests with others via a link, enabling participants to take the test without the need for an account.</p>
                        </div>
                        
                        <img src="~/assets/img/feature_shots/share.png">
                    </div>

                    <div id="features">
                        <div class="cont">
                            <div class="icon">
                                <IconsDatabase :color="'fill-cyan-700'" :size="20" />
                            </div>
                            <p class="title">Automated Grading</p>
                            <p class="descri">Testar automatically grades questions, saving users time and effort in manual grading, and offers a great test-taking experience for participants.</p>
                        </div>
                        
                        <img src="~/assets/img/feature_shots/grading.png">
                    </div>
                </div>

            </div>
        </div>

        <img src="~/assets/img/home-asset1.png" class="w-full rotate-180">

    </div>
</template>

<style scoped>
#features {@apply flex flex-col md2:flex-row items-center mb-14 md2:mb-28 last:mb-0}
#features:nth-child(even) .cont {@apply md2:order-2 md2:mr-0 md2:ml-4}
#features .cont{@apply md2:mr-4}
#features .cont .title{@apply text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-500}
#features .cont .descri{@apply text-neutral-500 text-base md:text-lg}
#features .cont .icon{@apply border border-cyan-600 rounded-md px-2 py-1 hidden md:inline-block }
#features .cont .icon svg{@apply -mt-1}

#features img{@apply max-w-full sm:max-w-xl md2:max-w-md lg:max-w-lg border rounded-lg shadow-lg md:shadow-xl mt-3 md2:mt-0}
</style>