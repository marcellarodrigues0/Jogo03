
document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS PRINCIPAIS
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const socialToggle = document.getElementById("socialToggle");
  const socialBar = document.querySelector(".social-bar");
  const backToTop = document.getElementById("backToTop");
  const heroVideo = document.querySelector(".hero-video");

  // MENU PARA CELULAR
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");

        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");

        mainNav.querySelectorAll("a").forEach(item => {
          item.classList.remove("active");
        });

        link.classList.add("active");
      });
    });
  }

  // RECOLHER REDES SOCIAIS
  if (socialToggle && socialBar) {
    socialToggle.addEventListener("click", () => {
      const collapsed = socialBar.classList.toggle("collapsed");

      socialToggle.textContent = collapsed ? "‹" : "›";
      socialToggle.setAttribute(
        "aria-label",
        collapsed ? "Mostrar redes sociais" : "Recolher redes sociais"
      );
    });
  }

  // BOTÃO VOLTAR AO TOPO
  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    updateBackToTop();

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // FILTROS DA LISTA DE NOTÍCIAS
  const filterButtons = document.querySelectorAll(".filter-button");
  const newsRows = document.querySelectorAll(".news-row");
  const emptyNews = document.getElementById("emptyNews");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      let visibleCount = 0;

      filterButtons.forEach(item => {
        item.classList.toggle("selected", item === button);
      });

      newsRows.forEach(row => {
        const matches =
          category === "todos" ||
          row.dataset.category === category;

        row.hidden = !matches;

        if (matches) {
          visibleCount++;
        }
      });

      if (emptyNews) {
        emptyNews.hidden = visibleCount !== 0;
      }
    });
  });

  // ABRIR E FECHAR JANELAS
  function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) {
      console.warn(`Janela "${id}" não encontrada no HTML.`);
      return;
    }

    document.querySelectorAll(".modal.open").forEach(open => {
      open.classList.remove("open");
      open.setAttribute("aria-hidden", "true");
    });

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeButton = modal.querySelector(".modal-close");

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal.open")) {
      document.body.style.overflow = "";
    }
  }

  // BOTÕES QUE ABREM JANELAS
  document.querySelectorAll("[data-modal]").forEach(button => {
    button.addEventListener("click", () => {
      openModal(button.dataset.modal);
    });
  });

  // BOTÕES QUE FECHAM JANELAS
  document.querySelectorAll(
    ".modal-close, [data-close-modal]"
  ).forEach(button => {
    button.addEventListener("click", () => {
      closeModal(button.closest(".modal"));
    });
  });

  // FECHAR AO CLICAR FORA DA JANELA
  document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  // FECHAR COM ESC
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach(modal => {
        closeModal(modal);
      });
    }
  });

  // DETALHES DAS NOTÍCIAS
  document.querySelectorAll("[data-article]").forEach(button => {
    button.addEventListener("click", () => {
      const title = document.getElementById("articleModalTitle");
      const image = document.getElementById("articleModalImage");
      const description = document.getElementById("articleModalDescription");

      if (title) {
        title.textContent = button.dataset.article;
      }

      // Carregar a imagem específica da notícia
      if (image) {
        const imagePath = button.dataset.image;

        if (imagePath) {
          image.src = imagePath;
          image.alt = button.dataset.article || "Imagem da notícia";
          image.hidden = false;

          image.onerror = () => {
            image.hidden = true;
          };
        } else {
          image.removeAttribute("src");
          image.hidden = true;
        }
      }

      // Descrição opcional definida no botão
      if (description) {
        description.textContent =
          button.dataset.description || "";
      }

      openModal("articleModal");
    });
  });

  // DETALHES DAS REGIÕES
  document.querySelectorAll("[data-region]").forEach(button => {
    button.addEventListener("click", () => {
      const title = document.getElementById("regionModalTitle");

      if (title) {
        title.textContent = button.dataset.region;
      }

      openModal("regionModal");
    });
  });

  // TRATAR IMAGENS QUE NÃO CARREGAREM
  document.querySelectorAll(
    ".feature-image img, .list-image img"
  ).forEach(img => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  // VÍDEO DE FUNDO
  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      heroVideo.style.display = "none";
    });
  }

  // DESTAQUE AUTOMÁTICO DO MENU CONFORME A SEÇÃO VISÍVEL
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const active =
            link.getAttribute("href") === `#${entry.target.id}`;

          link.classList.toggle("active", active);
        });
      });
    }, {
      rootMargin: "-30% 0px -60% 0px"
    });

    sections.forEach(section => observer.observe(section));
  }
});
