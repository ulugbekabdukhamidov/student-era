(() => {
  const translations = {
    ru: {
      navArticles: "Статьи",
      navSections: "Рубрики",
      navAbout: "О журнале",

      eyebrow: "ОНЛАЙН-ЖУРНАЛ · УЗБЕКИСТАН",
      heroTitle: "Твои годы.<br>Твои идеи.<br><em>Твоя эпоха.</em>",
      heroText: "Журнал о современной студенческой жизни: учёба, проекты, люди и возможности, которые помогают строить будущее.",
      heroButton: 'Исследовать журнал <span>↗</span>',

      latestEyebrow: "ВЫБОР РЕДАКЦИИ",
      latestTitle: 'Свежие идеи<span>.</span>',
      searchPlaceholder: "Найти статью...",
      emptyState: "Ничего не найдено. Попробуй другой запрос.",

      categoriesEyebrow: "ТВОЯ ЭПОХА — ТВОИ ТЕМЫ",
      categoriesTitle: 'Выбирай направление<span>.</span>',

      catAcademics: "Учёба",
      catAcademicsDesc: "Учись осознаннее.",

      catProjects: "Проекты",
      catProjectsDesc: "Создавай своё.",

      catProductivity: "Продуктивность",
      catProductivityDesc: "Планируй с умом.",

      catPeople: "Люди",
      catPeopleDesc: "Настоящие истории.",

      catOpportunities: "Возможности",
      catOpportunitiesDesc: "Найди следующий шаг.",

      catLife: "Студенческая жизнь",
      catLifeDesc: "Баланс и развитие.",

      showAll: "Показать все статьи ↗",

      aboutEyebrow: "ЗАЧЕМ МЫ ЗДЕСЬ",
      aboutTitle: "Студенческая жизнь —<br>это больше, чем диплом<span>.</span>",
      aboutText: "STUDENT ERA — независимый онлайн-журнал о людях, идеях и возможностях, которые формируют новое поколение студентов Узбекистана.",
      contactLink: "Предложить тему или историю ↗",

      footerText: "Создано для тех, кто строит своё будущее.",
      backTop: "Наверх ↑",

      readMore: "Читать статью ↗",
      readMinutes: "мин чтения"
    },

    en: {
      navArticles: "Articles",
      navSections: "Sections",
      navAbout: "About",

      eyebrow: "ONLINE JOURNAL · UZBEKISTAN",
      heroTitle: "Your years.<br>Your ideas.<br><em>Your era.</em>",
      heroText: "A journal about modern student life: learning, projects, people, and opportunities that help shape the future.",
      heroButton: 'Explore the journal <span>↗</span>',

      latestEyebrow: "EDITOR'S PICKS",
      latestTitle: 'Fresh ideas<span>.</span>',
      searchPlaceholder: "Find an article...",
      emptyState: "No articles found. Try another search.",

      categoriesEyebrow: "YOUR ERA — YOUR TOPICS",
      categoriesTitle: 'Find your direction<span>.</span>',

      catAcademics: "Academics",
      catAcademicsDesc: "Learn with intention.",

      catProjects: "Projects",
      catProjectsDesc: "Build your own thing.",

      catProductivity: "Productivity",
      catProductivityDesc: "Plan with purpose.",

      catPeople: "People",
      catPeopleDesc: "Real stories.",

      catOpportunities: "Opportunities",
      catOpportunitiesDesc: "Find your next step.",

      catLife: "Student life",
      catLifeDesc: "Balance and growth.",

      showAll: "Show all articles ↗",

      aboutEyebrow: "WHY WE'RE HERE",
      aboutTitle: "Student life is<br>more than a degree<span>.</span>",
      aboutText: "STUDENT ERA is an independent online journal about the people, ideas, and opportunities shaping a new generation of students in Uzbekistan.",
      contactLink: "Suggest a topic or story ↗",

      footerText: "Made for those building their future.",
      backTop: "Back to top ↑",

      readMore: "Read article ↗",
      readMinutes: "min read"
    }
  };

  let language = "ru";
  let activeCategory = "all";

  const grid = document.getElementById("articleGrid");
  const search = document.getElementById("searchInput");
  const dialog = document.getElementById("articleDialog");

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      return entities[character];
    });
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage;

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const value = translations[language][key];

      if (value !== undefined) {
        element.innerHTML = value;
      }
    });

    document
      .querySelectorAll("[data-i18n-placeholder]")
      .forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        const value = translations[language][key];

        if (value !== undefined) {
          element.placeholder = value;
        }
      });

    document.getElementById("langToggle").textContent =
      language === "ru" ? "EN ↗" : "RU ↗";

    renderArticles();
  }

  function renderArticles() {
    const articles = window.STUDENT_ERA_ARTICLES || [];

    const query = search.value
      .trim()
      .toLocaleLowerCase();

    const filtered = articles.filter(article => {
      const data = article[language];

      const matchesCategory =
        activeCategory === "all" ||
        article.category === activeCategory;

      const searchableText = (
        data.title + " " +
        data.excerpt + " " +
        data.category
      ).toLocaleLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(query)
      );
    });

    grid.innerHTML = filtered.map(article => {
      const data = article[language];

      return `
        <article class="article-card">

          <div class="card-top">
            <span>${escapeHTML(data.category)}</span>
            <span>
              ${article.read}
              ${escapeHTML(translations[language].readMinutes)}
            </span>
          </div>

          <div class="card-mark">
            ${escapeHTML(article.mark)}
          </div>

          <h3>${escapeHTML(data.title)}</h3>

          <p>${escapeHTML(data.excerpt)}</p>

          <button
            class="read-link"
            type="button"
            data-open-article="${escapeHTML(article.id)}"
          >
            ${escapeHTML(translations[language].readMore)}
          </button>

        </article>
      `;
    }).join("");

    document.getElementById("emptyState").hidden =
      filtered.length > 0;

    document.querySelectorAll(".category-card").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === activeCategory
      );
    });
  }

  function openArticle(id) {
    const articles = window.STUDENT_ERA_ARTICLES || [];

    const article = articles.find(item => item.id === id);

    if (!article) return;

    const data = article[language];

    document.getElementById("dialogCategory").textContent =
      data.category;

    document.getElementById("dialogTitle").textContent =
      data.title;

    document.getElementById("dialogMeta").textContent =
      `${article.date} · ${article.read} ${
        translations[language].readMinutes
      }`;

    document.getElementById("dialogBody").innerHTML =
      data.body;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  document
    .getElementById("langToggle")
    .addEventListener("click", () => {
      setLanguage(language === "ru" ? "en" : "ru");
    });

  search.addEventListener("input", renderArticles);

  document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      activeCategory =
        activeCategory === category ? "all" : category;

      renderArticles();

      document.getElementById("latest").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  document.getElementById("showAll").addEventListener("click", () => {
    activeCategory = "all";
    search.value = "";

    renderArticles();

    document.getElementById("latest").scrollIntoView({
      behavior: "smooth"
    });
  });

  grid.addEventListener("click", event => {
    const button = event.target.closest("[data-open-article]");

    if (button) {
      openArticle(button.dataset.openArticle);
    }
  });

  document
    .getElementById("closeDialog")
    .addEventListener("click", () => {
      dialog.close();
    });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  document.getElementById("year").textContent =
    new Date().getFullYear();

  setLanguage(language);
})();
