import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export const useAuthStore = defineStore("authStore", () => {
    const accessToken: Ref<string | undefined> = ref(undefined);
    const cloudId: Ref<string | undefined> = ref(undefined);
    const accountId: Ref<string | undefined> = ref(undefined);

    return {
        accessToken,
        cloudId,
        accountId
    };
});
