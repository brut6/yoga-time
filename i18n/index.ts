
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      auth: {
        ui: {
          signIn: "Вход",
          signUp: "Регистрация",
          emailPlaceholder: "Email",
          passwordPlaceholder: "Пароль",
          continue: "Продолжить",
          google: "Войти через Google",
          notNow: "Позже",
          or: "или",
          syncTitle: "Синхронизация",
          syncDesc: "Войдите, чтобы синхронизировать избранное и настройки между устройствами.",
          signOut: "Выйти"
        },
        errors: {
          invalidEmail: "Некорректный email",
          userDisabled: "Пользователь заблокирован",
          userNotFound: "Пользователь не найден",
          wrongPassword: "Неверный пароль",
          emailInUse: "Email уже используется",
          popupClosed: "Вход отменен",
          weakPassword: "Пароль слишком простой",
          unknown: "Произошла ошибка входа",
          notConfigured: "Сервис авторизации недоступен"
        }
      },
      nav: {
        home: "Главная",
        retreats: "Путешествия",
        breath: "Дыхание",
        teachers: "Проводники",
        profile: "Профиль",
        organizer: "Организатор",
        dashboard: "Дашборд",
        admin: "Админ"
      },
      admin: {
        title: "Панель Администратора",
        tabs: {
          users: "Пользователи",
          retreats: "Ретриты",
          guides: "Проводники"
        },
        requireOnline: "Админ-панель требует онлайн-соединения",
        table: {
          name: "Имя",
          role: "Роль",
          actions: "Действия",
          title: "Название",
          organizer: "Организатор",
          location: "Локация"
        },
        actions: {
          makeOrganizer: "Сделать Организатором",
          makeStudent: "Сделать Студентом",
          delete: "Удалить",
          view: "Просмотр",
          unpublish: "Снять с публикации",
          publish: "Опубликовать"
        },
        filters: {
          all: "Все",
          published: "Опубликовано",
          draft: "Черновики"
        },
        search: "Поиск...",
        confirmDelete: "Вы уверены, что хотите удалить этот элемент?"
      },
      common: {
        brandName: "YOGA TIME",
        back: "Назад",
        loadMore: "Показать больше",
        bookNow: "Забронировать",
        save: "В избранное",
        saved: "Сохранено",
        details: "Подробнее",
        viewProfile: "Открыть профиль",
        viewRetreat: "Исследовать",
        startingFrom: "от",
        sessionFrom: "Сессия",
        contact: "Написать",
        sendMessage: "Начать диалог",
        bookSession: "Записаться",
        perPerson: "за гостя",
        perHour: "/ час",
        dates: "Даты",
        rating: "Рейтинг",
        location: "Локация",
        rate: "Энергообмен",
        about: "О проводнике",
        aboutOrganizer: "Об организаторе",
        languages: "Языки",
        backToRetreats: "К коллекции",
        backToInstructors: "К проводникам",
        notFoundRetreat: "Тур не найден",
        notFoundInstructor: "Проводник не найден",
        viewAll: "Все",
        days: "дн.",
        daysShort: "дн.",
        dayShort: "дн.",
        demoMode: "Демо-режим",
        demoModeBanner: "Ваш платеж не будет списан (Демо)",
        investorDeck: "Инвесторам",
        on: "ВКЛ",
        off: "ВЫКЛ",
        currentPlan: "Ваш план",
        apply: "Применить",
        reset: "Сброс",
        close: "Закрыть",
        skip: "Пропустить",
        years: "лет",
        experience: "Путь",
        reviews: "Истории",
        certifications: "Линия передачи",
        specializations: "Мастерство",
        forWho: "Для кого",
        uploadFromLibrary: "Выбрать фото",
        replace: "Заменить",
        remove: "Удалить",
        addPhotos: "Добавить",
        makeCover: "Сделать обложкой",
        useUrl: "Ссылка",
        or: "или",
        online: "Онлайн",
        inPerson: "Лично",
        verified: "Подтвержденный мастер",
        readMore: "Читать далее",
        yearsExp: "{{count}} лет практики",
        vibes: "Атмосфера и Состояние",
        chooseVibe: "Выберите, что откликается сейчас",
        recommendedForVibe: "Для состояния: {{vibe}}",
        matchesForVibe: "Подбор: {{vibe}}",
        guidesForMood: "Проводники по настроению",
        retreatsForMood: "Ретриты по настроению",
        clearFilter: "Сбросить",
        noExactVibeMatch: "Точных совпадений нет — показаны похожие варианты",
        yourVibe: "Ваш Vibe",
        currentState: "Текущее состояние",
        cancel: "Отмена",
        create: "Создать",
        basedOnReviews: "На основе {{count}} историй",
        contentLanguageNote: "Контент доступен на английском",
        greetings: {
          morning: "Доброе утро",
          afternoon: "Добрый день",
          evening: "Добрый вечер"
        },
        studentProfile: "Профиль студента",
        practiceLevel: "Уровень практики",
        interests: "Интересы",
        bio: "О себе",
        joined: "В клубе с",
        offlineProfile: "Профиль недоступен офлайн"
      },
      paywall: {
        title: "Выберите план",
        subtitle: "Инвестируйте в свое состояние.",
        current: "Текущий",
        monthly: "/ месяц",
        restore: "Восстановить покупки",
        benefits: {
          breathing: "Практики дыхания",
          streak: "Серия практик",
          filters: "Расширенные фильтры",
          organizer: "Доступ к организаторам",
          support: "Поддержка"
        },
        plans: {
          free: {
            name: "Бесплатный",
            desc: "Базовый доступ к приложению"
          },
          premium: {
            name: "Премиум",
            desc: "Расширенные возможности для практики"
          },
          pro: {
            name: "Про",
            desc: "Полный доступ без ограничений"
          }
        },
        alerts: {
          demoUpgrade: "Это демо-режим. План обновлен локально.",
          restoreMock: "Покупки восстановлены (Демо)."
        }
      },
      profile: {
        title: "Профиль",
        manage: "Управление аккаунтом",
        role: "Ваша роль",
        language: "Язык приложения",
        savedStats: "Сохранено",
        yourName: "Ваше имя",
        roles: {
          student: "Студент",
          organizer: "Организатор",
          instructor: "Проводник",
          admin: "Администратор"
        },
        bioPlaceholder: "Расскажите о своем пути в йоге...",
        locationPlaceholder: "Ваш город",
        interestsPlaceholder: "Йога, Медитация, Путешествия...",
        languagesPlaceholder: "Русский, English...",
        viewPublic: "Посмотреть публичный профиль",
        levels: {
          beginner: "Начинающий",
          intermediate: "Практикующий",
          advanced: "Продвинутый"
        }
      },
      labels: {
        avatar: "Аватар",
        coverPhoto: "Обложка",
        gallery: "Галерея",
        uploadAvatar: "Загрузить аватар",
        namePlaceholder: "Как к вам обращаться?"
      },
      saved: {
        title: "Избранное",
        guidesTitle: "Сохранённые проводники",
        retreatsTitle: "Сохранённые ретриты",
        searchPlaceholder: "Поиск...",
        noGuides: "Пока нет сохранённых проводников",
        noRetreats: "Пока нет сохранённых ретритов",
        goToDiscovery: "Перейти к подбору",
        tabs: {
          retreats: "Путешествия",
          teachers: "Проводники"
        },
        emptyRetreats: {
          title: "Список пуст",
          desc: "Вы пока не добавили ни одного ретрита.",
          action: "Искать"
        },
        emptyInstructors: {
          title: "Список пуст",
          desc: "Вы пока не добавили ни одного проводника.",
          action: "Искать"
        }
      },
      instructorDashboard: {
        title: "Дашборд",
        tabs: {
          overview: "Обзор",
          content: "Контент",
          pricing: "Цены",
          students: "Ученики"
        },
        totalRevenue: "Выручка",
        activeStudents: "Активные ученики",
        earnings: "Доходы",
        rating: "Рейтинг",
        content: "Мой контент",
        createNew: "Создать",
        cancel: "Отмена",
        newProduct: "Новый продукт",
        productTitlePlaceholder: "Название...",
        createBtn: "Создать",
        products: {
          course: "Курс",
          meditation: "Медитация",
          workshop: "Воркшоп"
        },
        baseRate: "Базовая ставка",
        packages: "Пакеты",
        packagesDesc: {
          single: "Разовое занятие",
          bundle: "Пакет из {{count}} занятий"
        }
      },
      breathing: {
        title: "Практика Дыхания",
        subtitle: "Выберите ритм, чтобы настроить состояние.",
        start: "Начать практику",
        stop: "Завершить",
        done: "Готово",
        streak: "Серия дней",
        inhale: "Вдох",
        hold: "Задержка",
        exhale: "Выдох",
        hold_empty: "Пауза",
        completeTitle: "Практика завершена",
        completeSubtitle: "Вы сделали вклад в свое спокойствие.",
        sections: {
          style: "Визуализация",
          rhythm: "Ритм дыхания",
          sound: "Звуковое поле"
        },
        styleSelection: {
          field: {
            title: "Поле Висама",
            subtitle: "Плавность",
            desc: "Мягкие волны для глубокого расслабления и потока."
          },
          geometry: {
            title: "Сакральная Геометрия",
            subtitle: "Структура",
            desc: "Четкие формы для концентрации и ясности ума."
          }
        },
        pattern: {
          balance: "Баланс (Когерентность)",
          deep: "Глубокий покой (4-7-8)",
          visama_soft: "Мягкий поток",
          visama_deep: "Глубокое погружение",
          sama_square: "Квадратное дыхание"
        },
        patternDesc: {
          balance: "Выравнивает вариабельность сердечного ритма. Идеально для начала дня.",
          deep: "Мощная техника для снятия стресса и быстрого засыпания.",
          visama_soft: "Нежный ритм для успокоения эмоций.",
          visama_deep: "Интенсивная практика для глубоких состояний.",
          sama_square: "Классическая техника для фокуса и стабилизации."
        },
        sounds: {
          zen: "Дзен (Бинауральные)",
          ocean: "Тихий Океан",
          rain: "Летний Дождь",
          forest: "Священный Лес"
        }
      },
      organizer: {
        notFound: "Организатор не найден",
        retreats: "Путешествия организатора",
        noRetreats: "Нет активных ретритов",
        noDescription: "Создаем премиальные велнес-путешествия с вниманием к деталям."
      },
      home: {
        subtitle: "Найдите баланс. Ретриты, проводники и практики дыхания.",
        dailyRitual: "Ритуал дня",
        dailyFocus: "Утренний Дзен",
        dailyFocusDesc: "2 минуты дыхания для настройки на день.",
        featuredRetreat: "Избранные путешествия",
        topInstructors: "Проводники"
      },
      booking: {
        book: "Забронировать",
        bookSession: "Назначить встречу",
        selectPackage: "Формат взаимодействия",
        sessions: "встреч"
      },
      instructors: {
        title: "Проводники",
        subtitle: "Те, кто бережно направит вашу практику.",
        searchPlaceholder: "Имя или направление...",
        results: "Найдено: {{count}}",
        noResults: "Проводники не найдены",
        clearFilters: "Сброс",
        findMatch: "✨ Найти своего проводника",
        conciergeTitle: "Нужна помощь?",
        conciergeDesc: "Мы поможем найти того, кто вам действительно подойдет.",
        conciergeBtn: "Помощь консьержа",
        fit: {
          title: "Подход и Энергия",
          trialAvailable: "Доступно знакомство",
          toneLabel: "Тон общения",
          approach: {
            gentle: "Бережный и Мягкий",
            structured: "Структурный",
            energetic: "Энергичный",
            therapeutic: "Целительный"
          },
          tone: {
            soft: "Заботливый",
            neutral: "Спокойный",
            direct: "Прямой"
          },
          whyFit: "Точки соприкосновения"
        },
        checklist: {
          title: "Как почувствовать своего учителя",
          items: {
            goal: "Спросите себя, что вы ищете сейчас",
            style: "Выберите стиль, который отзывается в теле",
            qualifications: "Узнайте о линии передачи знаний",
            trial: "Попробуйте встречу-знакомство",
            reviews: "Почитайте истории других людей",
            comfort: "Доверьтесь внутренней интуиции"
          },
          cta: "Записаться на знакомство"
        },
        modal: {
          title: "Настройки поиска",
          sections: {
            guide: "Мастер",
            practiceVibe: "Практика"
          },
          sortBy: "Порядок",
          languages: "Язык",
          price: "Энергообмен",
          styles: "Стиль",
          mode: "Формат",
          level: "Ваш уровень",
          experience: "Опыт мастера",
          specializations: "Фокус",
          city: "Город",
          cityPlaceholder: "Например: Убуд",
          verified: "Только верифицированные",
          vibe: "Ощущение",
          sortOptions: {
            recommended: "Рекомендации",
            rating: "По отзывам",
            priceLow: "Цена (мин)",
            priceHigh: "Цена (макс)",
            experienceHigh: "По опыту",
            verifiedFirst: "Сначала проверенные"
          },
          priceOptions: {
            budget: "Доступно",
            standard: "Баланс",
            premium: "Премиум"
          },
          modeOptions: {
            online: "Онлайн",
            in_person: "Лично",
            both: "Любой"
          },
          levelOptions: {
            beginner: "Начинаю путь",
            intermediate: "В практике",
            advanced: "Глубокое погружение"
          },
          experienceOptions: {
            junior: "Начало пути",
            mid: "Опытный",
            senior: "Мастер"
          },
          vibeOptions: {
            soft: "Мягкость",
            therapeutic: "Терапия",
            athletic: "Сила",
            spiritual: "Дух"
          }
        },
        trust: {
          sessions: "{{count}} сессий",
          responds: "Отвечает быстро",
          highDemand: "🔥 Востребован",
          bookedOut: "Запись через {{days}} дн"
        }
      },
      smartMatch: {
        title: "Smart Match",
        subtitle: "Позвольте нам найти того, кто бережно направит вас.",
        next: "Далее",
        matchesFound: "Ваши совпадения",
        matchPercentLabel: "Совпадение",
        matchReason: "Соответствует вашему запросу",
        resultsSubtitle: "Подобрано по вашему запросу и вайбу.",
        resultsSubtitleDNA: "Особая подборка для состояния: {{persona}}",
        analyzing: "Прислушиваемся к вашему запросу...",
        loadingTitle: "Настройка...",
        hint: "Выберите то, что отзывается",
        noExactMatches: "Точных совпадений нет, но взгляните на этих мастеров.",
        reasons: {
          goal: "Отвечает вашему намерению",
          style: "Стиль: {{style}}",
          approach: "Подход: {{val}}",
          verified: "Проверенный мастер",
          rating: "Высокое доверие",
          levelBeginner: "Бережный старт: безопасно и тепло",
          levelAdvanced: "Глубина знаний и линии передачи",
          softVoice: "Мягкий голос и забота",
          masterTeacher: "Мудрость глубокого опыта",
          methodology: "Точность и методология"
        },
        steps: {
          level: {
            question: "Где вы сейчас в своей практике?",
            options: {
              beginner: "В начале пути (Ищу поддержку)",
              intermediate: "Регулярно практикую",
              advanced: "Глубокое погружение (Ищу детали)"
            }
          },
          goal: {
            question: "Каково ваше главное намерение?",
            options: {
              stress: "Обрести покой и тишину",
              strength: "Почувствовать силу тела",
              flexibility: "Свобода движения",
              spiritual: "Духовный поиск"
            }
          },
          style: {
            question: "Какой стиль вам ближе?",
            options: {
              vinyasa: "Виньяса (Поток)",
              hatha: "Хатха (Основа)",
              yin: "Инь (Замедление)",
              meditation: "Медитация (Созерцание)"
            }
          },
          approach: {
            question: "Какой подход вам откликается?",
            options: {
              gentle: "Мягкий и оберегающий",
              structured: "Ясный и точный",
              energetic: "Заряжающий энергией",
              therapeutic: "Глубокий и целительный"
            }
          },
          trial: {
            question: "Важно ли пробное знакомство?",
            options: {
              yes: "Да, хочу познакомиться",
              no: "Я доверяю интуиции"
            }
          }
        }
      },
      retreatSmartMatch: {
        title: "Smart Match",
        findMatch: "✨ Найти путешествие",
        noMatches: "Взгляните на эти варианты.",
        matchesFound: "Ваши совпадения",
        matchReason: "Подходит вашему состоянию",
        reasons: {
          silence: "Тишина",
          dnaMatch: "Совпадение по Vibe DNA",
        },
        questions: {
          goal: "Ваше намерение?",
          difficulty: "Интенсивность?",
          silence: "Важна ли тишина?",
          comfort: "Уровень комфорта?"
        },
        options: {
          goal: {
            stress: "Отпустить лишнее",
            healing: "Исцеление",
            spiritual: "Духовный рост",
            detox: "Здоровье тела"
          },
          difficulty: {
            light: "Легкая (Отдых)",
            deep: "Глубокая (Баланс)",
            hardcore: "Интенсив (Дисциплина)"
          },
          silence: {
            yes: "Да, хочу тишины",
            no: "Нет, хочу общения"
          },
          comfort: {
            simple: "Простота",
            comfort: "Уют",
            luxury: "Изобилие"
          }
        }
      },
      retreatDetails: {
        gallery: "Галерея",
        transformation: "Ваша трансформация",
        dailyJourney: "Путь по дням",
        programComingSoon: "Программа скоро появится...",
        program: "Программа",
        included: "Входит в опыт",
        reviews: "Впечатления гостей",
        day: "День"
      },
      organizerPage: {
        title: "Портал Организатора",
        subtitle: "Создавайте и управляйте ретритами.",
        createTitle: "Создать новое путешествие",
        draftsTitle: "Черновики",
        publishedTitle: "Опубликовано",
        saveDraft: "Сохранить черновик",
        publish: "Опубликовать",
        preview: "Предпросмотр",
        hidePreview: "Скрыть",
        emptyDrafts: "У вас пока нет черновиков.",
        emptyPublished: "Нет опубликованных ретритов.",
        form: {
          title: "Название",
          country: "Страна",
          city: "Локация",
          startDate: "Начало",
          endDate: "Завершение",
          price: "Стоимость",
          currency: "Валюта",
          tags: "Теги (через запятую)",
          dailyJourney: "Дневная программа (Обязательно)",
          addDay: "+ Добавить день",
          dayTitle: "Тема дня (например, Заземление)",
          dayDesc: "Описание (что будет происходить?)"
        },
        placeholders: {
          untitled: "Без названия",
          unknownCity: "Неизвестно",
          unknownCountry: "Неизвестно"
        },
        alerts: {
          demoPublish: "Это демо-режим. Ретрит будет сохранен локально.",
          programRequired: "Пожалуйста, добавьте хотя бы 1 день программы."
        }
      },
      schedule: {
        title: "Программа",
        comingSoon: "Программа скоро появится...",
        journeyArc: "Арка путешествия",
        phase: "Фаза",
        viewFull: "Смотреть полную программу"
      },
      journey: {
        title: "Ваш Путь",
        notAvailable: "Путь не доступен",
        before: "До",
        during: "Во время",
        after: "После",
        keyTips: "Ключевые советы",
        aftercare: {
          title: "Интеграция",
          support: "Поддержка"
        }
      },
      investor: {
        label: "Инвесторам",
        subtitle: "Масштабируемая wellness-платформа.",
        techStack: "React 18 • TypeScript • Vite • PWA",
        metrics: {
          retention: "Удержание",
          retentionVal: "68%",
          monetization: "Конверсия",
          monetizationVal: "4.2%",
          global: "Рынок",
          globalVal: "$1.2T"
        },
        links: {
          home: "Главная (Витрина)",
          breathing: "Дыхание (Утилита)",
          retreats: "Ретриты (Маркетплейс)",
          paywall: "Пэйвол (Монетизация)"
        },
        roadmap: "План развития",
        roadmapItems: {
          1: "AI-персонализация контента",
          2: "Интеграция с Apple Health",
          3: "Live-трансляции",
          4: "Корпоративная подписка",
          5: "Токенизация лояльности"
        },
        partnerTitle: "Стать партнером",
        partnerSubtitle: "Давайте строить будущее wellness вместе.",
        contact: "Связаться",
        explore: "Демонстрация"
      },
      errors: {
        fileTooLarge: "Файл слишком большой"
      },
      dna: {
        title: "Vibe DNA",
        subtitle: "Узнайте свой поток",
        checkIn: "Check-in",
        update: "Обновить",
        recommendation: "Рекомендация",
        intensity: "Интенсивность",
        personas: {
          healer: { title: "Целитель" },
          power: { title: "Сила" },
          dreamer: { title: "Мечтатель" },
          flow: { title: "Поток" }
        },
        intensities: {
          gentle: "Мягкая",
          moderate: "Умеренная",
          fiery: "Огненная"
        },
        quiz: {
          q1: "Как ваш уровень энергии?",
          a1_low: "Низкий (Нужен отдых)",
          a1_med: "Средний (Баланс)",
          a1_high: "Высокий (Нужен выход)",
          q2: "Что вы чувствуете?",
          a2_stress: "Стресс / Тревога",
          a2_good: "Спокойствие",
          a2_focus: "Фокус / Ясность",
          q3: "Ваша цель сейчас?",
          a3_rest: "Глубокий отдых",
          a3_sweat: "Активность тела",
          a3_spirit: "Связь с духом"
        }
      },
      data: {
        retreats: {
          retreat_1: {
            title: "Пробуждение на Бали: Погружение в Джунгли",
            program: {
              day1: { title: "Прибытие и Круг Знакомства", description: "Добро пожаловать на Бали. Заселение и встреча с племенем." },
              day2: { title: "Поток Корневой Чакры", description: "Практика заземления для связи с землей." },
              day3: { title: "Очищение в Храме Воды", description: "Традиционный балийский ритуал очищения." },
              day4: { title: "Тишина и Рефлексия", description: "День благородной тишины для углубления практики." },
              day5: { title: "Церемония Какао", description: "Раскрытие сердца через радость и любовь." },
              day6: { title: "Восход на Вулкане", description: "Опциональный хайкинг чтобы встретить рассвет." },
              day7: { title: "Закрывающий Круг", description: "Интеграция и прощание." }
            }
          }
        }
      }
    }
  },
  en: {
    translation: {
      auth: {
        ui: {
          signIn: "Sign In",
          signUp: "Create Account",
          emailPlaceholder: "Email",
          passwordPlaceholder: "Password",
          continue: "Continue",
          google: "Continue with Google",
          notNow: "Not Now",
          or: "or",
          syncTitle: "Sync Devices",
          syncDesc: "Sign in to sync your favorites and settings across all your devices.",
          signOut: "Sign Out"
        },
        errors: {
          invalidEmail: "Invalid email address",
          userDisabled: "User disabled",
          userNotFound: "User not found",
          wrongPassword: "Incorrect password",
          emailInUse: "Email already in use",
          popupClosed: "Sign in cancelled",
          weakPassword: "Password should be stronger",
          unknown: "Authentication error",
          notConfigured: "Auth service not configured"
        }
      },
      common: {
        brandName: "YOGA TIME",
        back: "Back",
        loadMore: "Load more",
        bookNow: "Book Now",
        save: "Save",
        saved: "Saved",
        details: "Details",
        viewProfile: "View Profile",
        viewRetreat: "Explore",
        startingFrom: "from",
        sessionFrom: "Session",
        contact: "Contact",
        sendMessage: "Message",
        bookSession: "Book Session",
        perPerson: "per person",
        perHour: "/ hour",
        dates: "Dates",
        rating: "Rating",
        location: "Location",
        rate: "Energy Exchange",
        about: "About",
        aboutOrganizer: "About Organizer",
        languages: "Languages",
        backToRetreats: "Back to Retreats",
        backToInstructors: "Back to Instructors",
        notFoundRetreat: "Retreat not found",
        notFoundInstructor: "Instructor not found",
        viewAll: "View All",
        days: "days",
        daysShort: "days",
        dayShort: "days",
        demoMode: "Demo Mode",
        demoModeBanner: "Your payment will not be charged (Demo)",
        investorDeck: "Investor Deck",
        on: "ON",
        off: "OFF",
        currentPlan: "Current Plan",
        apply: "Apply",
        reset: "Reset",
        close: "Close",
        skip: "Skip",
        years: "yrs",
        experience: "Experience",
        reviews: "Reviews",
        certifications: "Certifications",
        specializations: "Specializations",
        forWho: "For Who",
        uploadFromLibrary: "Upload",
        replace: "Replace",
        remove: "Remove",
        addPhotos: "Add Photos",
        makeCover: "Make Cover",
        useUrl: "Use URL",
        or: "or",
        online: "Online",
        inPerson: "In Person",
        verified: "Verified",
        readMore: "Read More",
        yearsExp: "{{count}} years exp",
        vibes: "Vibe & Atmosphere",
        chooseVibe: "Select what resonates",
        recommendedForVibe: "For: {{vibe}}",
        matchesForVibe: "Match: {{vibe}}",
        guidesForMood: "Guides for your mood",
        retreatsForMood: "Retreats for your mood",
        clearFilter: "Clear",
        noExactVibeMatch: "No exact matches — showing closest options",
        yourVibe: "Your Vibe",
        currentState: "Current State",
        cancel: "Cancel",
        create: "Create",
        basedOnReviews: "Based on {{count}} reviews",
        contentLanguageNote: "Content available in English",
        greetings: {
          morning: "Good morning",
          afternoon: "Good afternoon",
          evening: "Good evening"
        },
        studentProfile: "Student profile",
        practiceLevel: "Practice level",
        interests: "Interests",
        bio: "Bio",
        joined: "Joined",
        offlineProfile: "Profile unavailable offline"
      },
      paywall: {
        title: "Choose Plan",
        subtitle: "Invest in your wellbeing.",
        current: "Current",
        monthly: "/ month",
        restore: "Restore Purchases",
        benefits: {
          breathing: "Breathing practices",
          streak: "Practice streak",
          filters: "Advanced filters",
          organizer: "Organizer access",
          support: "Support"
        },
        plans: {
          free: {
            name: "Free",
            desc: "Basic access to the app"
          },
          premium: {
            name: "Premium",
            desc: "Extended practice features"
          },
          pro: {
            name: "Pro",
            desc: "Full unlimited access"
          }
        },
        alerts: {
          demoUpgrade: "This is demo mode. Plan updated locally.",
          restoreMock: "Purchases restored (Demo)."
        }
      },
      profile: {
        title: "Profile",
        manage: "Manage Account",
        role: "Your Role",
        language: "App Language",
        savedStats: "Saved Items",
        yourName: "Your Name",
        roles: {
          student: "Student",
          organizer: "Organizer",
          instructor: "Instructor",
          admin: "Admin"
        },
        bioPlaceholder: "Share your yoga journey...",
        locationPlaceholder: "Your city",
        interestsPlaceholder: "Yoga, Meditation, Travel...",
        languagesPlaceholder: "English, Spanish...",
        viewPublic: "View Public Profile",
        levels: {
          beginner: "Beginner",
          intermediate: "Intermediate",
          advanced: "Advanced"
        }
      },
      labels: {
        avatar: "Avatar",
        coverPhoto: "Cover Photo",
        gallery: "Gallery",
        uploadAvatar: "Upload avatar",
        namePlaceholder: "How should we call you?"
      },
      saved: {
        title: "Saved",
        guidesTitle: "Saved Guides",
        retreatsTitle: "Saved Retreats",
        searchPlaceholder: "Search...",
        noGuides: "No saved guides yet",
        noRetreats: "No saved retreats yet",
        goToDiscovery: "Go to discovery",
        tabs: {
          retreats: "Retreats",
          teachers: "Mentors"
        },
        emptyRetreats: {
          title: "List is empty",
          desc: "You haven't saved any retreats yet.",
          action: "Explore"
        },
        emptyInstructors: {
          title: "List is empty",
          desc: "You haven't saved any mentors yet.",
          action: "Explore"
        }
      },
      instructorDashboard: {
        title: "Dashboard",
        tabs: {
          overview: "Overview",
          content: "Content",
          pricing: "Pricing",
          students: "Students"
        },
        totalRevenue: "Total Revenue",
        activeStudents: "Active Students",
        earnings: "Earnings",
        rating: "Rating",
        content: "My Content",
        createNew: "Create New",
        cancel: "Cancel",
        newProduct: "New Product",
        productTitlePlaceholder: "Title...",
        createBtn: "Create",
        products: {
          course: "Course",
          meditation: "Meditation",
          workshop: "Workshop"
        },
        baseRate: "Base Rate",
        packages: "Packages",
        packagesDesc: {
          single: "Single session",
          bundle: "Bundle of {{count}} sessions"
        }
      },
      breathing: {
        title: "Breath Practice",
        subtitle: "Select a rhythm to tune your state.",
        start: "Start Practice",
        stop: "Stop",
        done: "Done",
        streak: "Day Streak",
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        hold_empty: "Pause",
        completeTitle: "Practice Complete",
        completeSubtitle: "You have contributed to your peace.",
        sections: {
          style: "Visual Style",
          rhythm: "Rhythm",
          sound: "Soundscape"
        },
        styleSelection: {
          field: {
            title: "Visama Field",
            subtitle: "Fluidity",
            desc: "Gentle waves for deep flow and relaxation."
          },
          geometry: {
            title: "Sacred Geometry",
            subtitle: "Structure",
            desc: "Clear forms for focus and mental clarity."
          }
        },
        pattern: {
          balance: "Balance (Coherence)",
          deep: "Deep Rest (4-7-8)",
          visama_soft: "Soft Flow",
          visama_deep: "Deep Dive",
          sama_square: "Square Breath"
        },
        patternDesc: {
          balance: "Aligns heart rate variability. Perfect for starting the day.",
          deep: "Powerful technique for stress relief and falling asleep.",
          visama_soft: "Gentle rhythm to soothe emotions.",
          visama_deep: "Intense practice for deep states.",
          sama_square: "Classic technique for focus and stabilization."
        },
        sounds: {
          zen: "Zen (Binaural)",
          ocean: "Pacific Ocean",
          rain: "Summer Rain",
          forest: "Sacred Forest"
        }
      },
      organizer: {
        notFound: "Organizer not found",
        retreats: "Organizer's Journeys",
        noRetreats: "No active retreats",
        noDescription: "Curating exceptional wellness experiences."
      },
      retreatDetails: {
        gallery: "Gallery",
        transformation: "Your Transformation",
        dailyJourney: "Daily Journey",
        programComingSoon: "Program coming soon...",
        program: "Program",
        included: "Included",
        reviews: "Guest Reviews",
        day: "Day"
      },
      organizerPage: {
        title: "Organizer Portal",
        subtitle: "Create and manage retreats.",
        createTitle: "Create New Journey",
        draftsTitle: "Drafts",
        publishedTitle: "Published",
        saveDraft: "Save Draft",
        publish: "Publish",
        preview: "Preview",
        hidePreview: "Hide",
        emptyDrafts: "No drafts yet.",
        emptyPublished: "No published retreats.",
        form: {
          title: "Title",
          country: "Country",
          city: "Location",
          startDate: "Start Date",
          endDate: "End Date",
          price: "Price",
          currency: "Currency",
          tags: "Tags (comma separated)",
          dailyJourney: "Daily Journey (Required)",
          addDay: "+ Add Day",
          dayTitle: "Day Theme",
          dayDesc: "Description"
        },
        placeholders: {
          untitled: "Untitled",
          unknownCity: "Unknown",
          unknownCountry: "Unknown"
        },
        alerts: {
          demoPublish: "This is demo mode. Retreat saved locally.",
          programRequired: "Please add at least 1 day to the program."
        }
      },
      schedule: {
        title: "Schedule",
        comingSoon: "Program coming soon...",
        journeyArc: "Journey Arc",
        phase: "Phase",
        viewFull: "View Full Schedule"
      },
      journey: {
        title: "Your Journey",
        notAvailable: "Journey not available",
        before: "Before",
        during: "During",
        after: "After",
        keyTips: "Key Tips",
        aftercare: {
          title: "Integration",
          support: "Support"
        }
      },
      investor: {
        label: "Investor",
        subtitle: "Scalable wellness platform.",
        techStack: "React 18 • TypeScript • Vite • PWA",
        metrics: {
          retention: "Retention",
          retentionVal: "68%",
          monetization: "Conversion",
          monetizationVal: "4.2%",
          global: "Market",
          globalVal: "$1.2T"
        },
        links: {
          home: "Home (Storefront)",
          breathing: "Breathing (Utility)",
          retreats: "Retreats (Marketplace)",
          paywall: "Paywall (Monetization)"
        },
        roadmap: "Roadmap",
        roadmapItems: {
          1: "AI Content Personalization",
          2: "Apple Health Integration",
          3: "Live Streaming",
          4: "Corporate Subscription",
          5: "Loyalty Tokenization"
        },
        partnerTitle: "Partner with us",
        partnerSubtitle: "Let's build the future of wellness together.",
        contact: "Contact",
        explore: "Explore Demo"
      },
      errors: {
        fileTooLarge: "File too large"
      },
      dna: {
        title: "Vibe DNA",
        subtitle: "Discover your flow",
        checkIn: "Check-in",
        update: "Update",
        recommendation: "Recommendation",
        intensity: "Intensity",
        personas: {
          healer: { title: "Healer" },
          power: { title: "Power" },
          dreamer: { title: "Dreamer" },
          flow: { title: "Flow" }
        },
        intensities: {
          gentle: "Gentle",
          moderate: "Moderate",
          fiery: "Fiery"
        },
        quiz: {
          q1: "How is your energy?",
          a1_low: "Low (Need rest)",
          a1_med: "Medium (Balanced)",
          a1_high: "High (Need outlet)",
          q2: "What are you feeling?",
          a2_stress: "Stress / Anxiety",
          a2_good: "Good / Calm",
          a2_focus: "Focus / Clarity",
          q3: "Your goal right now?",
          a3_rest: "Deep Rest",
          a3_sweat: "Physical Sweat",
          a3_spirit: "Spiritual Connection"
        }
      },
      admin: {
        title: "Admin Dashboard",
        tabs: {
          users: "Users",
          retreats: "Retreats",
          guides: "Guides"
        },
        requireOnline: "Admin panel requires online connection",
        table: {
          name: "Name",
          role: "Role",
          actions: "Actions",
          title: "Title",
          organizer: "Organizer",
          location: "Location"
        },
        actions: {
          makeOrganizer: "Promote to Organizer",
          makeStudent: "Demote to Student",
          delete: "Delete",
          view: "View",
          unpublish: "Unpublish",
          publish: "Publish"
        },
        filters: {
          all: "All",
          published: "Published",
          draft: "Drafts"
        },
        search: "Search...",
        confirmDelete: "Are you sure you want to delete this item?"
      },
      data: {
        retreats: {
          retreat_1: {
            title: "Awaken in Bali: Jungle Immersion",
            program: {
              day1: { title: "Arrival & Opening Circle", description: "Welcome to Bali. Settle in and meet your tribe." },
              day2: { title: "Root Chakra Flow", description: "Grounding practice to connect with the earth." },
              day3: { title: "Water Temple Purification", description: "Traditional Balinese cleansing ritual." },
              day4: { title: "Silence & Reflection", description: "A day of noble silence to deepen your practice." },
              day5: { title: "Heart Opening Cacao Ceremony", description: "Connect with joy and love." },
              day6: { title: "Sunrise Volcano Hike", description: "Optional hike to witness the dawn." },
              day7: { title: "Closing Circle", description: "Integration and farewells." }
            }
          }
        }
      }
    }
  },
  he: {
    translation: {
      auth: {
        ui: {
          signIn: "התחברות",
          signUp: "הרשמה",
          emailPlaceholder: "אימייל",
          passwordPlaceholder: "סיסמה",
          continue: "המשך",
          google: "המשך עם גוגל",
          notNow: "לא עכשיו",
          or: "או",
          syncTitle: "סנכרון מכשירים",
          syncDesc: "התחבר כדי לסנכרן את המועדפים וההגדרות בין כל המכשירים.",
          signOut: "התנתק"
        },
        errors: {
          invalidEmail: "כתובת אימייל לא חוקית",
          userDisabled: "משתמש חסום",
          userNotFound: "משתמש לא נמצא",
          wrongPassword: "סיסמה שגויה",
          emailInUse: "האימייל כבר בשימוש",
          popupClosed: "ההתחברות בוטלה",
          weakPassword: "הסיסמה חלשה מדי",
          unknown: "שגיאת התחברות",
          notConfigured: "שירות ההתחברות אינו זמין"
        }
      },
      nav: {
        home: "בית",
        retreats: "ריטריטים",
        breath: "נשימה",
        teachers: "מורים",
        profile: "פרופיל",
        organizer: "מארגן",
        dashboard: "לוח בקרה",
        admin: "ניהול"
      },
      admin: {
        title: "לוח ניהול",
        tabs: {
          users: "משתמשים",
          retreats: "ריטריטים",
          guides: "מדריכים"
        },
        requireOnline: "לוח הניהול דורש חיבור לאינטרנט",
        table: {
          name: "שם",
          role: "תפקיד",
          actions: "פעולות",
          title: "כותרת",
          organizer: "מארגן",
          location: "מיקום"
        },
        actions: {
          makeOrganizer: "הפוך למארגן",
          makeStudent: "הפוך לסטודנט",
          delete: "מחק",
          view: "צפה",
          unpublish: "בטל פרסום",
          publish: "פרסם"
        },
        filters: {
          all: "הכל",
          published: "פורסם",
          draft: "טיוטות"
        },
        search: "חיפוש...",
        confirmDelete: "האם אתה בטוח שברצונך למחוק פריט זה?"
      },
      common: {
        brandName: "YOGA TIME",
        back: "חזור",
        loadMore: "טען עוד",
        bookNow: "הזמן עכשיו",
        save: "שמור",
        saved: "נשמר",
        details: "פרטים",
        viewProfile: "צפה בפרופיל",
        viewRetreat: "גלה עוד",
        startingFrom: "החל מ-",
        sessionFrom: "סשן",
        contact: "צור קשר",
        sendMessage: "שלח הודעה",
        bookSession: "קבע פגישה",
        perPerson: "לאדם",
        perHour: "/ שעה",
        dates: "תאריכים",
        rating: "דירוג",
        location: "מיקום",
        rate: "תעריף",
        about: "אודות",
        aboutOrganizer: "אודות המארגן",
        languages: "שפות",
        backToRetreats: "חזרה לריטריטים",
        backToInstructors: "חזרה למורים",
        notFoundRetreat: "ריטריט לא נמצא",
        notFoundInstructor: "מורה לא נמצא",
        viewAll: "הכל",
        days: "ימים",
        daysShort: "ימ'",
        dayShort: "יום",
        demoMode: "מצב דמו",
        demoModeBanner: "לא תחויב בתשלום (דמו)",
        investorDeck: "למשקיעים",
        on: "פעיל",
        off: "כבוי",
        currentPlan: "תוכנית נוכחית",
        apply: "החל",
        reset: "איפוס",
        close: "סגור",
        skip: "דלג",
        years: "שנים",
        experience: "ניסיון",
        reviews: "ביקורות",
        certifications: "הסמכות",
        specializations: "התמחויות",
        forWho: "למי מתאים",
        uploadFromLibrary: "העלאה",
        replace: "החלף",
        remove: "הסר",
        addPhotos: "הוסף תמונות",
        makeCover: "קבע כתמונה ראשית",
        useUrl: "השתמש בקישור",
        or: "או",
        online: "אונליין",
        inPerson: "פרונטלי",
        verified: "מאומת",
        readMore: "קרא עוד",
        yearsExp: "{{count}} שנות ניסיון",
        vibes: "אווירה",
        chooseVibe: "בחר את האווירה המתאימה",
        recommendedForVibe: "עבור: {{vibe}}",
        matchesForVibe: "התאמה: {{vibe}}",
        guidesForMood: "מדריכים לפי מצב הרוח",
        retreatsForMood: "ריטריטים לפי מצב הרוח",
        clearFilter: "איפוס",
        noExactVibeMatch: "אין התאמות מדויקות — מוצגות אפשרויות דומות",
        yourVibe: "הווייב שלך",
        currentState: "מצב נוכחי",
        cancel: "ביטול",
        create: "צור",
        basedOnReviews: "מבוסס על {{count}} ביקורות",
        contentLanguageNote: "התוכן זמין כרגע באנגלית",
        greetings: {
          morning: "בוקר טוב",
          afternoon: "צהריים טובים",
          evening: "ערב טוב"
        },
        studentProfile: "פרופיל תלמיד",
        practiceLevel: "רמת תרגול",
        interests: "תחומי עניין",
        bio: "ביוגרפיה",
        joined: "הצטרף ב",
        offlineProfile: "הפרופיל לא זמין במצב לא מקוון"
      },
      paywall: {
        title: "בחר תוכנית",
        subtitle: "השקיעו ברווחה שלכם.",
        current: "נוכחי",
        monthly: "/ חודש",
        restore: "שחזר רכישות",
        benefits: {
          breathing: "תרגילי נשימה",
          streak: "רצף תרגול",
          filters: "מסננים מתקדמים",
          organizer: "גישה למארגנים",
          support: "תמיכה"
        },
        plans: {
          free: {
            name: "חינמי",
            desc: "גישה בסיסית לאפליקציה"
          },
          premium: {
            name: "פרימיום",
            desc: "אפשרויות תרגול מתקדמות"
          },
          pro: {
            name: "פרו",
            desc: "גישה מלאה ללא הגבלה"
          }
        },
        alerts: {
          demoUpgrade: "זהו מצב דמו. התוכנית עודכנה מקומית.",
          restoreMock: "הרכישות שוחזרו (דמו)."
        }
      },
      profile: {
        title: "פרופיל",
        manage: "ניהול חשבון",
        role: "התפקיד שלך",
        language: "שפת אפליקציה",
        savedStats: "נשמר",
        yourName: "השם שלך",
        roles: {
          student: "תלמיד",
          organizer: "מארגן",
          instructor: "מורה",
          admin: "מנהל"
        },
        bioPlaceholder: "שתף את מסע היוגה שלך...",
        locationPlaceholder: "העיר שלך",
        interestsPlaceholder: "יוגה, מדיטציה, טיולים...",
        languagesPlaceholder: "אנגלית, עברית...",
        viewPublic: "צפה בפרופיל ציבורי",
        levels: {
          beginner: "מתחיל",
          intermediate: "בינוני",
          advanced: "מתקדם"
        }
      },
      labels: {
        avatar: "תמונת פרופיל",
        coverPhoto: "תמונת נושא",
        gallery: "גלריה",
        uploadAvatar: "העלאת אווטאר",
        namePlaceholder: "איך לקרוא לך?"
      },
      saved: {
        title: "נשמר",
        guidesTitle: "מדריכים שמורים",
        retreatsTitle: "ריטריטים שמורים",
        searchPlaceholder: "חיפוש...",
        noGuides: "עדיין אין מדריכים שמורים",
        noRetreats: "עדיין אין ריטריטים שמורים",
        goToDiscovery: "לגילוי אפשרויות",
        tabs: {
          retreats: "ריטריטים",
          teachers: "מורים"
        },
        emptyRetreats: {
          title: "הרישמה ריקה",
          desc: "עדיין לא שמרת ריטריטים.",
          action: "חפש"
        },
        emptyInstructors: {
          title: "הרישמה ריקה",
          desc: "עדיין לא שמרת מורים.",
          action: "חפש"
        }
      },
      instructorDashboard: {
        title: "לוח בקרה",
        tabs: {
          overview: "סקירה",
          content: "תוכן",
          pricing: "מחירים",
          students: "תלמידים"
        },
        totalRevenue: "הכנסות",
        activeStudents: "תלמידים פעילים",
        earnings: "רווחים",
        rating: "דירוג",
        content: "התוכן שלי",
        createNew: "צור חדש",
        cancel: "ביטול",
        newProduct: "מוצר חדש",
        productTitlePlaceholder: "כותרת...",
        createBtn: "צור",
        products: {
          course: "קורס",
          meditation: "מדיטציה",
          workshop: "סדנה"
        },
        baseRate: "תעריף בסיס",
        packages: "חבילות",
        packagesDesc: {
          single: "מפגש יחיד",
          bundle: "חבילה של {{count}} מפגשים"
        }
      },
      breathing: {
        title: "תרגול נשימה",
        subtitle: "בחר קצב כדי לכוון את התודעה.",
        start: "התחל תרגול",
        stop: "עצור",
        done: "סיום",
        streak: "רצף ימים",
        inhale: "שאיפה",
        hold: "החזקה",
        exhale: "נשיפה",
        hold_empty: "השהיה",
        completeTitle: "התרגול הושלם",
        completeSubtitle: "תרמת לשלווה הפנימית שלך.",
        sections: {
          style: "סגנון ויזואלי",
          rhythm: "קצב",
          sound: "סאונד"
        },
        styleSelection: {
          field: {
            title: "שדה ויסאמה",
            subtitle: "זרימה",
            desc: "גלים רכים לרגיעה עמוקה."
          },
          geometry: {
            title: "גיאומטריה מקודשת",
            subtitle: "מבנה",
            desc: "צורות ברורות למיקוד ובהירות."
          }
        },
        pattern: {
          balance: "איזון (קוהרנטיות)",
          deep: "מנוחה עמוקה (4-7-8)",
          visama_soft: "זרימה רכה",
          visama_deep: "צלילה עמוקה",
          sama_square: "נשימה מרובעת"
        },
        patternDesc: {
          balance: "מאזן את קצב הלב. מושלם לתחילת היום.",
          deep: "טכניקה עוצמתית להפחתת לחץ והירדמות.",
          visama_soft: "קצב עדין להרגעת רגשות.",
          visama_deep: "תרגול אינטנסיבי למצבים עמוקים.",
          sama_square: "טכניקה קלאסית למיקוד ויציבות."
        },
        sounds: {
          zen: "זן (בינאורלי)",
          ocean: "אוקיינוס שקט",
          rain: "גשם קיץ",
          forest: "יער קדוש"
        }
      },
      organizer: {
        notFound: "מארגן לא נמצא",
        retreats: "מסעות המארגן",
        noRetreats: "אין ריטריטים פעילים כרגע",
        noDescription: "יוצרים חוויות בריאות יוצאות דופן."
      },
      retreatDetails: {
        gallery: "גלריה",
        transformation: "המסע שלך",
        dailyJourney: "לוח זמנים יומי",
        programComingSoon: "התוכנית תפורסם בקרוב...",
        program: "תוכנית",
        included: "כלול בחבילה",
        reviews: "חוות דעת",
        day: "יום"
      },
      organizerPage: {
        title: "פורטל מארגנים",
        subtitle: "צור ונהל ריטריטים.",
        createTitle: "צור מסע חדש",
        draftsTitle: "טיוטות",
        publishedTitle: "פורסם",
        saveDraft: "שמור טיוטה",
        publish: "פרסם",
        preview: "תצוגה מקדימה",
        hidePreview: "הסתר",
        emptyDrafts: "אין טיוטות עדיין.",
        emptyPublished: "אין ריטריטים שפורסמו.",
        form: {
          title: "כותרת",
          country: "מדינה",
          city: "מיקום",
          startDate: "תאריך התחלה",
          endDate: "תאריך סיום",
          price: "מחיר",
          currency: "מטבע",
          tags: "תגיות (מופרד בפסיקים)",
          dailyJourney: "תוכנית יומית (חובה)",
          addDay: "+ הוסף יום",
          dayTitle: "נושא היום",
          dayDesc: "תיאור"
        },
        placeholders: {
          untitled: "ללא כותרת",
          unknownCity: "לא ידוע",
          unknownCountry: "לא ידוע"
        },
        alerts: {
          demoPublish: "זהו מצב דמו. הריטריט נשמר מקומית.",
          programRequired: "אנא הוסף לפחות יום אחד לתוכנית."
        }
      },
      schedule: {
        title: "תוכנית",
        comingSoon: "התוכנית תפורסם בקרוב...",
        journeyArc: "קשת המסע",
        phase: "שלב",
        viewFull: "צפה בתוכנית המלאה"
      },
      journey: {
        title: "המסע שלך",
        notAvailable: "המסע לא זמין",
        before: "לפני",
        during: "במהלך",
        after: "אחרי",
        keyTips: "טיפים מרכזיים",
        aftercare: {
          title: "אינטגרציה",
          support: "תמיכה"
        }
      },
      data: {
        retreats: {
          retreat_1: {
            title: "התעוררות בבאלי: טבילה בג'ונגל",
            program: {
              day1: { title: "הגעה ומעגל פתיחה", description: "ברוכים הבאים לבאלי. התמקמות ומפגש עם השבט." },
              day2: { title: "זרימת צ'אקרת השורש", description: "תרגול הארקה לחיבור לאדמה." },
              day3: { title: "טיהור במקדש המים", description: "טקס טיהור באלינזי מסורתי." },
              day4: { title: "שתיקה והתבוננות", description: "יום של שתיקה אצילית להעמקת התרגול." },
              day5: { title: "טקס קקאו לפתיחת הלב", description: "חיבור לשמחה ואהבה." },
              day6: { title: "טיפוס זריחה להר געש", description: "טיפוס אופציונלי לקבלת פני השחר." },
              day7: { title: "מעגל סיום", description: "אינטגרציה ופרידה." }
            }
          }
        }
      }
    }
  }
};

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('yt_lang') || 'ru' : 'ru';

if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === 'he' ? 'rtl' : 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
