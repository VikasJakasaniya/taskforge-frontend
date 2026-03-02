import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/',
        redirect: '/tasks'
    },
    {
        path: '/tasks',
        name: 'tasks',
        component: () => import('@/views/TasksView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/imports',
        name: 'imports',
        component: () => import('@/views/ImportsView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
        next('/login')
    } else if (to.meta.requiresGuest && authStore.isAuthenticated()) {
        next('/tasks')
    } else {
        next()
    }
})

export default router