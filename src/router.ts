import AuthenticationService, { AuthenticationStatus } from "@/services/authenticationService";
import LoginView from "@/views/LoginView.vue";
import WorklogView from "@/views/WorklogView.vue";
import {
    createMemoryHistory,
    createRouter,
    type RouteRecordRaw,
    type RouteMeta,
    type Router,
    type RouteLocationNormalized
} from "vue-router";

export class RouteDefinition {
    constructor() {
        this.router = createRouter({
            history: createMemoryHistory("index.html"),
            routes: this.routes
        });
        this.router.beforeEach(this.navigationGuard);
    }
    router: Router;

    routes: RouteRecordRaw[] = [
        {
            path: "/",
            name: "home",
            component: WorklogView,
            meta: { requiresAuth: true } as RouteMetadata
        },
        { path: "/login", name: "login", component: LoginView }
    ];

    async navigationGuard(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        const metadata = to.meta as RouteMetadata;
        if (metadata.requiresAuth) {
            const authenticationStatus = await AuthenticationService.getAuthenticationStatus();
            console.log(
                "Auth navigationguard",
                "Is authenticated:",
                authenticationStatus.toString()
            );
            if (authenticationStatus !== AuthenticationStatus.Authenticated) {
                return { name: "login" };
            }
        }
    }
}

interface RouteMetadata extends RouteMeta {
    [x: number]: unknown;
    [x: string]: unknown;
    [x: symbol]: unknown;
    requiresAuth: boolean;
}
