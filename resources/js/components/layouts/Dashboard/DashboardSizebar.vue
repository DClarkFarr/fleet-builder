<template>
    <div class="dashboard__sidebar min-h-full px-4 py-8 bg-gray-800 text-white">
        <div class="mb-10">
            <h1 class="text-xl">Dashboard</h1>
        </div>
        <div class="mb-2">
            <router-link
                :to="{ name: 'dashboard.ships' }"
                class="block p-2 hover:bg-black/25"
                >Ships</router-link
            >
        </div>
        <div class="mb-2">
            <router-link
                :to="{ name: 'dashboard.admirals' }"
                class="block p-2 hover:bg-black/25"
                >Admirals</router-link
            >
        </div>
        <div class="mb-2">
            <router-link
                :to="{ name: 'dashboard.classes' }"
                class="block p-2 hover:bg-black/25"
                >Ship Classes</router-link
            >
        </div>
        <div class="mb-2">
            <router-link
                :to="{ name: 'dashboard.levels' }"
                class="block p-2 hover:bg-black/25"
                >Ship Levels</router-link
            >
        </div>
        <div class="mb-2">
            <router-link
                :to="{ name: 'dashboard.users' }"
                class="block p-2 hover:bg-black/25"
                >Users</router-link
            >
        </div>
        <div class="mb-2">
            <a
                class="block p-2 hover:bg-black/25"
                href="/dashboard/tesseract"
                target="_blank"
            >
                Tesseract Trainer
            </a>
        </div>
    </div>
</template>
