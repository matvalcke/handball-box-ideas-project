import { Singleton } from "./util/Singleton.ts";

export class ServiceWorkerManager extends Singleton {
    private registration: ServiceWorkerRegistration | null = null;

    async register(): Promise<void | ServiceWorkerRegistration> {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            this.registration = registration;
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    getRegistration(): ServiceWorkerRegistration | null {
        return this.registration;
    }
}
