
const LANG_KEY = 'cristiano-portfolio-lang'

function getInitialLang() {
    try {
        const saved = localStorage.getItem(LANG_KEY)
        if (saved === 'pt' || saved === 'en') return saved
    } catch (e) {}
    return 'pt'
}

function updateStaticText(profileData, lang) {
    const t = profileData.i18n[lang].titles
    document.getElementById('i18n.greeting').innerText = profileData.i18n[lang].greeting
    document.getElementById('i18n.title.resumo').innerText = t.resumo
    document.getElementById('i18n.title.skills').innerText = t.skills
    document.getElementById('i18n.title.fiscalSkills').innerText = t.fiscalSkills
    document.getElementById('i18n.title.hardSkills').innerText = t.hardSkills
    document.getElementById('i18n.title.languages').innerText = t.languages
    document.getElementById('i18n.title.education').innerText = t.education
    document.getElementById('i18n.title.experience').innerText = t.experience
    document.getElementById('i18n.laudo').innerText = t.laudo
    document.getElementById('lang-current-label').innerText = lang === 'pt' ? 'Português' : 'English'
    document.getElementById('lang-current-flag').src = `assets/img/icons/flags/${lang === 'pt' ? 'br' : 'us'}.svg`
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US'
}

function updateProfileInfo(profileData, lang) {
    const photo = document.getElementById('profile.photo')
    photo.src = profileData.photo
    photo.alt = profileData.name

    const name = document.getElementById('profile.name')
    name.innerText = profileData.name

    const job = document.getElementById('profile.job')
    job.innerText = profileData.i18n[lang].job

    const location = document.getElementById('profile.location')
    location.innerText = profileData.i18n[lang].location

    const linkedin = document.getElementById('profile.linkedin')
    linkedin.innerText = profileData.i18n[lang].linkedinLabel
    linkedin.href = profileData.linkedinUrl

    const phone = document.getElementById('profile.phone')
    phone.innerText = `WhatsApp: ${profileData.phone}`
    const phoneDigits = profileData.phone.replace(/\D/g, '')
    const whatsappNumber = phoneDigits.startsWith('55') ? phoneDigits : `55${phoneDigits}`
    phone.href = `https://wa.me/${whatsappNumber}`
    phone.target = '_blank'

    const email = document.getElementById('profile.email')
    email.innerText = profileData.email
    email.href = `mailto:${profileData.email}`
}

function updateFiscalSkills(profileData) {
    const fiscalSkills = document.getElementById('profile.skills.fiscalSkills')
    fiscalSkills.innerHTML = profileData.skills.fiscalSkills.map(skill => `<li>${skill}</li>`).join('')
}

function updateHardSkills(profileData) {
    const hardSkills = document.getElementById('profile.skills.hardSkills')
    hardSkills.innerHTML = profileData.skills.hardSkills.map(skill => `<li><img src="${skill.logo}" alt="${skill.name}" title="${skill.name}"></li>`).join('')
}

function updateLanguages(profileData, lang) {
    const languages = document.getElementById('profile.languages')
    languages.innerHTML = profileData.i18n[lang].languages.map(language => `<li>${language}</li>`).join('')
}

function updateResumo(profileData, lang) {
    const resumo = document.getElementById('profile.resumo')
    resumo.innerHTML = profileData.i18n[lang].resumo.map(sobre => `<p><i>${sobre.description}</i></p>`).join('')
}

function updateEducation(profileData, lang) {
    const education = document.getElementById('profile.education')
    education.innerHTML = profileData.i18n[lang].education.map(edu => `
        <li>
            <h3 class="github">${edu.institution}</h3>
            <p class="course">${edu.course}</p>
            <p class="date">${edu.date}</p>
        </li>
    `).join('')
}

function updateProfessionalExperience(profileData, lang) {
    const professionalExperience = document.getElementById('profile.professionalExperience')
    professionalExperience.innerHTML = profileData.i18n[lang].professionalExperience.map(experience => `
        <li>
            <h3 class="company">${experience.company}</h3>
            <p class="role">${experience.role}<span class="period">${experience.period}</span></p>
            <p class="segment">${experience.segment}</p>
            <ul class="achievements">
                ${experience.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </li>
    `).join('')
}

function renderAll(profileData, lang) {
    const sections = [
        () => updateStaticText(profileData, lang),
        () => updateProfileInfo(profileData, lang),
        () => updateFiscalSkills(profileData),
        () => updateHardSkills(profileData),
        () => updateLanguages(profileData, lang),
        () => updateResumo(profileData, lang),
        () => updateEducation(profileData, lang),
        () => updateProfessionalExperience(profileData, lang)
    ]

    sections.forEach((run) => {
        try {
            run()
        } catch (error) {
            console.error('Falha ao renderizar seção:', error)
        }
    })
}

function setActiveLangButton(lang) {
    document.querySelectorAll('.lang-switch .lang-menu button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.lang === lang)
    })
}

(async () => {
    const profileData = await fetchProfileData()
    let currentLang = getInitialLang()

    renderAll(profileData, currentLang)
    setActiveLangButton(currentLang)

    const langSwitch = document.querySelector('.lang-switch')
    const langToggle = document.getElementById('lang-toggle')

    langToggle.addEventListener('click', (event) => {
        event.stopPropagation()
        const isOpen = langSwitch.classList.toggle('open')
        langToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    })

    document.addEventListener('click', (event) => {
        if (!langSwitch.contains(event.target)) {
            langSwitch.classList.remove('open')
            langToggle.setAttribute('aria-expanded', 'false')
        }
    })

    document.querySelectorAll('.lang-switch .lang-menu button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang
            langSwitch.classList.remove('open')
            langToggle.setAttribute('aria-expanded', 'false')
            if (lang === currentLang) return
            currentLang = lang
            try { localStorage.setItem(LANG_KEY, lang) } catch (e) {}
            renderAll(profileData, currentLang)
            setActiveLangButton(currentLang)
        })
    })
})()
