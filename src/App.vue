<template>
    <div class="p-3">
        <div class="w-100 d-flex justify-content-end">
            <button class="btn btn-primary me-3" @click="logAllStoredData">Log stored data</button>
            <RouterLink
                :to="{ name: 'login', replace: true }"
                class="btn btn-primary"
                @click="clearAllData"
                >Clear stored data</RouterLink
            >
        </div>
        <RouterView class="pt-5" />
    </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { MessagingService } from "./messagingService";

async function clearAllData() {
    await MessagingService.clearStoredData.invoke();
}

async function logAllStoredData() {
    const storedData = await MessagingService.getStoredData.invoke();
    console.group("Stored data");
    Object.keys(storedData).forEach((key) => {
        let data: string | object;
        try {
            data = JSON.parse(storedData[key]);
        } catch {
            data = storedData[key];
        }
        console.log(`Key: ${key}`, "value =>", data);
    });
    console.groupEnd();
}
</script>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
