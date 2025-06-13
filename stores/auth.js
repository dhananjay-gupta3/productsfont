import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    actions: {
        async login(email, password) {
            const config = useRuntimeConfig()
            const res = await $fetch('/auth/login', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                body: { email, password }
            })
            this.user = res.user
            this.token = res.token
            localStorage.setItem('token', res.token)
        },
        async register(name, email, password) {
            const config = useRuntimeConfig()
            const res = await $fetch('/auth/register', {
                baseURL: config.public.apiBaseUrl,
                method: 'POST',
                body: { name, email, password }
            })
            this.user = res.user
            this.token = res.token
            localStorage.setItem('token', res.token)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },
        async fetchUser() {
            const token = localStorage.getItem('token')
            if (!token) return
            const config = useRuntimeConfig()
            try {
                const res = await $fetch('/auth/me', {
                    baseURL: config.public.apiBaseUrl,
                    headers: { Authorization: `Bearer ${token}` }
                })
                this.user = res.user
                this.token = token
            } catch (err) {
                this.logout()
            }
        }
    }
})
