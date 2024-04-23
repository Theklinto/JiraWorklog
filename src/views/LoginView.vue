<template>
    <div class="text-white center">
        <div v-if="loading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>{{ loadingText }}</p>
        </div>
        <div v-else>
            <div class="p-5">
                {{ resultText }}
            </div>
            <div class="d-flex justify-content-center">
                <button
                    v-if="showLoginButton"
                    @click="beginAuthenticationFlow"
                    class="btn btn-primary"
                >
                    Log into Jira
                </button>
            </div>
        </div>
        <!-- <div>
            <button class="btn btn-secondary" @click="getAuthenticationStatus">Refresh</button>
        </div>
        <div>
            <button class="btn btn-secondary" @click="ChromeService.clearStoredData">
                Clear data
            </button>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ChromeService } from "@/chromeService";
import { ref, onMounted } from "vue";

const loading = ref(true);
const loadingText = ref("");

const resultText = ref("");
const showLoginButton = ref(false);

const emit = defineEmits<{
    (e: "authenticated", isAuthenticated: boolean): void;
}>();

onMounted(async () => {
    await ChromeService.clearStoredData();
    getAuthenticationStatus();
});

async function getAuthenticationStatus() {
    loadingText.value = "Fetching stored access token...";
    loading.value = true;

    const isAuthenticated = await ChromeService.isAuthenticated();
    if (isAuthenticated.authenticated) {
        resultText.value = "Access token has been fetched!";
        emit("authenticated", true);
    } else {
        resultText.value = "No access token registered";
        showLoginButton.value = true;
    }
    loading.value = false;
}

async function beginAuthenticationFlow() {
    loading.value = true;
    loadingText.value = "Requesting acess to Jira. A popup will open.";
    showLoginButton.value = false;

    const result = await ChromeService.launchAuthenticationFlow();
    if (result !== undefined) {
        emit("authenticated", true);
    }
}
</script>

<style scoped>
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
