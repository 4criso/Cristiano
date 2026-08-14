
const acordeonTriggers = document.querySelectorAll('.acordeon .trigger')

acordeonTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const acordeon = trigger.parentElement
        const isOpen = acordeon.classList.contains('open')

        document.querySelectorAll('.acordeon.open').forEach((openAcordeon) => {
            openAcordeon.classList.remove('open')
        })

        if (!isOpen) {
            acordeon.classList.add('open')
        }
    })
})
