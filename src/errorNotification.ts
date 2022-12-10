import {useQuasar} from 'quasar'

export function useErrorNotification(error: Error | unknown) {
    let text
    if (error instanceof Error) text = error.message
    else text = String(error)

    const $q = useQuasar()
    $q.notify({
        message: text,
        color: 'negative',
        closeBtn: true,
        timeout: 5000,
    })
}
