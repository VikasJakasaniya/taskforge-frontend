import { ref, onUnmounted } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useAuthStore } from '@/stores/auth'

window.Pusher = Pusher

// Make echo instance module-level singleton
let echoInstance = null
let subscriptions = new Map()

export function useWebSocket() {
    const authStore = useAuthStore()
    const isConnected = ref(false)
    const connectionError = ref(null)

    const initEcho = () => {
        if (echoInstance) {
            console.log('Echo already initialized')
            return echoInstance
        }

        if (!authStore.token) {
            console.error('No auth token available')
            return null
        }

        console.log('Initializing Echo connection...')

        try {
            console.log(authStore.token);
            echoInstance = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_WS_KEY || 'local-key',
                wsHost: import.meta.env.VITE_WS_HOST || 'localhost',
                wsPort: import.meta.env.VITE_WS_PORT || 8080,
                wssPort: import.meta.env.VITE_WS_PORT || 8080,
                forceTLS: import.meta.env.VITE_WS_FORCE_TLS === 'true',
                enabledTransports: ['ws', 'wss'],
                disableStats: true, // Disable stats for better performance
                authEndpoint: `${import.meta.env.VITE_API_URL}/api/broadcasting/auth`,
                auth: {
                    headers: {
                        Authorization: `Bearer ${authStore.token}`,
                        Accept: 'application/json',
                    }
                }
            })

            // Connection event handlers
            echoInstance.connector.pusher.connection.bind('connected', () => {
                console.log('WebSocket connected successfully')
                isConnected.value = true
                connectionError.value = null
            })

            echoInstance.connector.pusher.connection.bind('disconnected', () => {
                console.log('WebSocket disconnected')
                isConnected.value = false
            })

            echoInstance.connector.pusher.connection.bind('error', (err) => {
                console.error('WebSocket connection error:', err)
                connectionError.value = err.message || 'Connection failed'
            })

            echoInstance.connector.pusher.connection.bind('state_change', (states) => {
                console.log('WebSocket state changed:', states.current)
            })

            return echoInstance
        } catch (error) {
            console.error('Failed to initialize Echo:', error)
            connectionError.value = error.message
            return null
        }
    }

    const subscribeToImports = (userId, callbacks) => {
        const echo = initEcho()
        if (!echo) {
            console.error('❌ Cannot subscribe: Echo not initialized')
            return null
        }

        const channelName = `imports.${userId}`

        if (subscriptions.has(channelName)) {
            console.log('ℹ️ Already subscribed to', channelName)
            return subscriptions.get(channelName)
        }

        console.log('🔌 Subscribing to private channel:', channelName)

        try {
            const channel = echo.private(channelName)

            channel.subscribed(() => {
                console.log('✅ Successfully subscribed to', channelName)
            })

            channel.error((error) => {
                console.error('❌ Subscription error:', error)
            })

            if (callbacks.onProgress) {
                // Try WITHOUT leading dot (Laravel default)
                channel.listen('import.progress', (data) => {
                    console.log('📊 Progress (no dot):', data)
                    callbacks.onProgress(data)
                })

                // ALSO try WITH leading dot (just in case)
                channel.listen('.import.progress', (data) => {
                    console.log('📊 Progress (with dot):', data)
                    callbacks.onProgress(data)
                })
            }

            if (callbacks.onCompleted) {
                channel.listen('import.completed', (data) => {
                    console.log('✅ Completed (no dot):', data)
                    callbacks.onCompleted(data)
                })

                channel.listen('.import.completed', (data) => {
                    console.log('✅ Completed (with dot):', data)
                    callbacks.onCompleted(data)
                })
            }

            subscriptions.set(channelName, channel)
            return channel
        } catch (error) {
            console.error('❌ Subscription failed:', error)
            return null
        }
    }

    const unsubscribeFromImports = (userId) => {
        const channelName = `imports.${userId}`
        const channel = subscriptions.get(channelName)

        if (channel) {
            console.log(`Unsubscribing from ${channelName}`)
            channel.stopListening('import.progress')
            channel.stopListening('import.completed')
            echoInstance?.leave(channelName)
            subscriptions.delete(channelName)
        }
    }

    const disconnect = () => {
        if (echoInstance) {
            console.log('Disconnecting Echo...')
            subscriptions.forEach((channel, channelName) => {
                echoInstance.leave(channelName)
            })
            subscriptions.clear()
            echoInstance.disconnect()
            echoInstance = null
            isConnected.value = false
        }
    }

    // Auto-cleanup on unmount
    onUnmounted(() => {
        // Don't disconnect, just cleanup this component's subscriptions
        console.log('Component unmounted, keeping Echo connection alive')
    })

    return {
        initEcho,
        subscribeToImports,
        unsubscribeFromImports,
        disconnect,
        isConnected,
        connectionError
    }
}