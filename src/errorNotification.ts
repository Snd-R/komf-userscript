import type { QVueGlobals } from 'quasar'

export function errorNotification(error: Error | unknown, quasar: QVueGlobals) {
    let text
    if (error instanceof Error) text = error.message
    else text = String(error)

    quasar.notify({
        message: text,
        color: 'negative',
        closeBtn: true,
        timeout: 5000
    })
}
