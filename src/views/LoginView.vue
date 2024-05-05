<template>
    <div class="text-white center">
        <SpinnerComponent :is-loading="loading" :loading-text="loadingText" />
        <div v-if="!loading">
            <div class="p-5">
                {{ resultText }}
            </div>
            <div v-if="showLoginButton" class="d-flex justify-content-center">
                <button @click="beginAuthenticationFlow" class="btn btn-primary">
                    Authenticate using Jira
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import AuthenticationService, { AuthenticationStatus } from "@/services/authenticationService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const loading = ref(true);
const loadingText = ref("");

const router = useRouter();

const resultText = ref("");
const showLoginButton = ref(false);

onMounted(() => {
    getAuthenticationStatus();
});

async function getAuthenticationStatus() {
    loadingText.value = "Fetching stored access token...";
    loading.value = true;

    const authStatus = await AuthenticationService.getAuthenticationStatus();
    switch (authStatus) {
        case AuthenticationStatus.Authenticated: {
            resultText.value = "Access token has been fetched!";
            router.push({ name: "home" });
            break;
        }
        case AuthenticationStatus.UseRefreshToken: {
            resultText.value = "Reauthentication using refresh token is not yet supported";
            loading.value = false;
            showLoginButton.value = true;
            console.log("Use refresh token!");
            break;
        }
        case AuthenticationStatus.NotAuthenticated: {
            resultText.value = "No access token registered";
            showLoginButton.value = true;
            loading.value = false;
            break;
        }
    }
}

async function beginAuthenticationFlow() {
    loading.value = true;
    loadingText.value = "Requesting access to Jira. A popup should open shortly.";
    showLoginButton.value = false;

    const authResult = await AuthenticationService.launchAuthenticationFlow();
    if (authResult) {
        console.log("User has been correctly authenticated");
        router.push({ name: "home" });
        return;
    }

    loading.value = false;
    loadingText.value = "An error occured while fetching token.";
    showLoginButton.value = true;
}
</script>

<style></style>
