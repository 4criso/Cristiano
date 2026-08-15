
const acordeonTriggers = document.querySelectorAll('.acordeon .trigger')

function closeAcordeon(acordeon) {
    const content = acordeon.querySelector('.content')
    content.style.maxHeight = null
    acordeon.classList.remove('open')
}

function openAcordeon(acordeon) {
    const content = acordeon.querySelector('.content')
    acordeon.classList.add('open')
    content.style.maxHeight = content.scrollHeight + 'px'
}

acordeonTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const acordeon = trigger.parentElement
        const isOpen = acordeon.classList.contains('open')

        document.querySelectorAll('.acordeon.open').forEach((openAcordeon) => {
            closeAcordeon(openAcordeon)
        })

        if (!isOpen) {
            openAcordeon(acordeon)
        }
    })
})

window.addEventListener('resize', () => {
    document.querySelectorAll('.acordeon.open .content').forEach((content) => {
        content.style.maxHeight = content.scrollHeight + 'px'
    })
})
