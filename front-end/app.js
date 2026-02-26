const API_BASE_URL = 'http://localhost:3000';

async function apiFetch(url, options = {}) {
  const opts = { credentials: "include", ...options };
  if (opts.body && !(opts.body instanceof FormData)) {
    opts.headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, opts);
  if (response.status === 401) {
    window.location.href = "login.html";
    return null;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && data.message ? data.message : "Erro inesperado.";
    alert(message);
    return null;
  }

  return data;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("pt-BR");
}

function getTagClass(slug) {
  const map = {
    fps: "tag-fps",
    rpg: "tag-rpg"
  };
  return map[slug] || "tag-fps";
}

function getQueryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function handleLogout(event) {
  if (event) event.preventDefault();
  await apiFetch("/api/auth/logout", { method: "POST" });
  window.location.href = "login.html";
}

async function initHome() {
  const feed = document.getElementById("recent-topics");
  if (!feed) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const query = category ? `/api/topics?limit=20&category=${category}` : "/api/topics?limit=20";

  const result = await apiFetch(query);
  if (!result) return;

  feed.innerHTML = result.topics
    .map((topic) => {
      return `
        <div class="post-card">
          <div class="post-info">
            <span class="tag ${getTagClass(topic.slug)}">${topic.category}</span>
            <h3>${topic.title}</h3>
            <p>Postado por: <strong>${topic.username}</strong></p>
          </div>
          <div class="post-stats">
            <span>❤️ ${topic.likes_count}</span>
            <span>💬 ${topic.comments_count}</span>
            <a href="exibir_topico.html?id=${topic.id}" class="tag" style="background: #00f5ff; text-decoration: none; color: #111;">Ver</a>
          </div>
        </div>
      `;
    })
    .join("");
}

async function initNewTopic() {
  const select = document.getElementById("new-topic-category");
  if (!select) return;

  const result = await apiFetch("/api/categories");
  if (!result) return;

  select.innerHTML = `<option value="" disabled selected>Selecione uma categoria</option>`;
  select.innerHTML += result.categories
    .map((category) => `<option value="${category.slug}">${category.name}</option>`)
    .join("");
}

async function initCategories() {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;

  const result = await apiFetch("/api/categories");
  if (!result) return;

  grid.innerHTML = result.categories
    .map((category) => {
      return `
        <a href="index.html?category=${category.slug}" class="categoria-card" style="text-decoration: none; border: 1px solid #00f5ff; padding: 40px; border-radius: 15px; text-align: center; background: rgba(0, 245, 255, 0.1); transition: 0.3s;">
          <h2 style="color: #00f5ff;">${category.name}</h2>
          <p style="color: #ccc;">${category.description || ""}</p>
        </a>
      `;
    })
    .join("");
}

async function initProfile() {
  const profileName = document.getElementById("profile-name");
  const profileSince = document.getElementById("profile-since");
  const profileAvatar = document.getElementById("profile-avatar");
  const topicsContainer = document.getElementById("profile-topics");

  if (!profileName || !topicsContainer) return;

  const me = await apiFetch("/api/auth/me");
  if (!me) return;

  profileName.textContent = me.user.username.toUpperCase();
  profileSince.textContent = `Membro desde: ${formatDate(me.user.created_at)}`;
  if (me.user.avatar_url) {
    profileAvatar.src = me.user.avatar_url;
  }

  const topicsResult = await apiFetch("/api/users/me/topics");
  if (!topicsResult) return;

  topicsContainer.innerHTML = topicsResult.topics
    .map((topic) => {
      return `
        <div class="post-card">
          <div class="post-info">
            <span class="tag ${getTagClass(topic.slug)}">${topic.category}</span>
            <h3>${topic.title}</h3>
            <p>Postado em: ${formatDate(topic.created_at)}</p>
          </div>
          <div class="post-stats">
            <a href="editar_topico.html?id=${topic.id}" class="tag" style="background: #ff00ff; text-decoration: none; color: white; cursor: pointer;">Editar Post</a>
          </div>
        </div>
      `;
    })
    .join("");
}

async function initTopicView() {
  const topicId = getQueryId();
  if (!topicId) return;

  const topicTitle = document.getElementById("topic-title");
  const topicMeta = document.getElementById("topic-meta");
  const topicContent = document.getElementById("topic-content");
  const topicCategory = document.getElementById("topic-category");
  const likeCount = document.getElementById("like-count");
  const commentCount = document.getElementById("comment-count");
  const commentsTitle = document.getElementById("comments-title");
  const commentsList = document.getElementById("comments-list");

  const topicResult = await apiFetch(`/api/topics/${topicId}`);
  if (!topicResult) return;

  const topic = topicResult.topic;
  topicTitle.textContent = topic.title;
  topicMeta.textContent = `Escrito por ${topic.username} em ${formatDate(topic.created_at)}`;
  topicContent.innerHTML = `<p>${topic.content}</p>`;
  topicCategory.textContent = topic.category;
  topicCategory.className = `tag ${getTagClass(topic.slug)}`;
  likeCount.textContent = topic.likes_count;
  commentCount.textContent = topic.comments_count;

  const commentsResult = await apiFetch(`/api/topics/${topicId}/comments`);
  if (!commentsResult) return;

  commentsTitle.textContent = `Comentários (${commentsResult.comments.length})`;
  commentsList.innerHTML = commentsResult.comments
    .map((comment) => {
      return `
        <div class="comentario-card">
          <p><strong>${comment.username}</strong> <small style=\"color: #888;\">${formatDate(comment.created_at)}</small></p>
          <p>${comment.content}</p>
          <button class=\"btn-denunciar\" data-comment-id=\"${comment.id}\">Denunciar</button>
        </div>
      `;
    })
    .join("");

  // Adiciona handler de clique para denúncia
  document.querySelectorAll('.btn-denunciar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const commentId = btn.getAttribute('data-comment-id');
      const motivo = prompt('Descreva o motivo da denúncia:');
      if (!motivo) return;
      // Chamada à API para denunciar comentário (endpoint será implementado)
      try {
        const resp = await apiFetch(`/api/topics/comments/${commentId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
          body: JSON.stringify({ reason: motivo })
        });
        if (resp && resp.success) {
          alert('Comentário denunciado com sucesso!');
        } else {
          alert(resp && resp.message ? resp.message : 'Erro ao denunciar comentário.');
        }
      } catch (err) {
        alert('Erro ao denunciar comentário.');
      }
    });
  });
}

async function initEditTopic() {
  const topicId = getQueryId();
  if (!topicId) return;

  const categorySelect = document.getElementById("edit-topic-category");
  const form = document.getElementById("edit-topic-form");
  if (!form || !categorySelect) return;

  const categoriesResult = await apiFetch("/api/categories");
  if (!categoriesResult) return;

  categorySelect.innerHTML = categoriesResult.categories
    .map((category) => `<option value="${category.slug}">${category.name}</option>`)
    .join("");

  const topicResult = await apiFetch(`/api/topics/${topicId}`);
  if (!topicResult) return;

  form.titulo_post.value = topicResult.topic.title;
  form.conteudo_post.value = topicResult.topic.content;
  categorySelect.value = topicResult.topic.slug;
}

async function initAdmin() {
  const categoriesBody = document.getElementById("admin-categories-body");
  const reportsContainer = document.getElementById("admin-reports");

  if (!categoriesBody || !reportsContainer) return;

  const categoriesResult = await apiFetch("/api/categories");
  if (!categoriesResult) return;

  categoriesBody.innerHTML = categoriesResult.categories
    .map((category) => {
      return `
        <tr style="border-bottom: 1px solid #222;">
          <td style="padding: 10px;">${category.name}</td>
          <td>
            <button data-edit-category="${category.id}" class="tag" style="background: #ff00ff; border:none; cursor:pointer; padding: 5px 10px;">Editar</button>
            <button data-delete-category="${category.id}" class="tag" style="background: #ff0055; border:none; cursor:pointer; padding: 5px 10px;">Excluir</button>
          </td>
        </tr>
      `;
    })
    .join("");

  // Buscar denúncias de tópicos
  const reportsResult = await apiFetch("/api/admin/reports");
  // Buscar denúncias de comentários
  const commentReportsResult = await apiFetch("/api/admin/reports/comments");
  if (!reportsResult && !commentReportsResult) return;

  let html = '';
  if (reportsResult && reportsResult.reports.length > 0) {
    html += '<h3 style="color:#ff0055;">Denúncias de Tópicos</h3>';
    html += reportsResult.reports
      .map((report) => {
        return `
          <div class="post-card" style="background: rgba(255, 0, 0, 0.1); border-left: 5px solid #ff0055; margin-top: 15px; padding: 15px;">
            <div class="post-info">
              <h4 style="color: white;">${report.title}</h4>
              <p style="color: #ccc;">Reportado por: <strong>${report.reporter}</strong></p>
              <p style="color: #ccc;">Motivo: ${report.reason || 'Não informado'}</p>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button data-report-action="excluir" data-report-id="${report.id}" class="btn-logout" style="background: #ff0055; padding: 8px 15px; border: none; cursor: pointer;">EXCLUIR</button>
              <button data-report-action="ignorar" data-report-id="${report.id}" class="tag" style="background: #333; padding: 8px 15px; border: none; cursor: pointer; color: white;">IGNORAR</button>
            </div>
          </div>
        `;
      })
      .join("");
  }
  if (commentReportsResult && commentReportsResult.reports.length > 0) {
    html += '<h3 style="color:#ff0055; margin-top:30px;">Denúncias de Comentários</h3>';
    html += commentReportsResult.reports
      .map((report) => {
        return `
          <div class="post-card" style="background: rgba(255, 0, 0, 0.08); border-left: 5px solid #ff0055; margin-top: 15px; padding: 15px;">
            <div class="post-info">
              <h4 style="color: white;">Comentário de ${report.commented_by}</h4>
              <p style="color: #ccc;">Conteúdo: <em>${report.comment_content}</em></p>
              <p style="color: #ccc;">Reportado por: <strong>${report.reporter}</strong></p>
              <p style="color: #ccc;">Motivo: ${report.reason || 'Não informado'}</p>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button data-comment-report-action="excluir" data-comment-report-id="${report.id}" class="btn-logout" style="background: #ff0055; padding: 8px 15px; border: none; cursor: pointer;">EXCLUIR</button>
              <button data-comment-report-action="ignorar" data-comment-report-id="${report.id}" class="tag" style="background: #333; padding: 8px 15px; border: none; cursor: pointer; color: white;">IGNORAR</button>
            </div>
          </div>
        `;
      })
      .join("");
  }
  if (!html) {
    html = '<p style="color:#ccc;">Nenhuma denúncia pendente.</p>';
  }
  reportsContainer.innerHTML = html;

  // Handlers para denúncias de tópicos
  document.querySelectorAll('[data-report-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-report-id');
      const action = btn.getAttribute('data-report-action');
      if (!id || !action) return;
      if (!confirm('Tem certeza?')) return;
      const resp = await apiFetch(`/api/admin/reports/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      if (resp && resp.message) alert(resp.message);
      await initAdmin();
    });
  });
  // Handlers para denúncias de comentários
  document.querySelectorAll('[data-comment-report-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-comment-report-id');
      const action = btn.getAttribute('data-comment-report-action');
      if (!id || !action) return;
      if (!confirm('Tem certeza?')) return;
      const resp = await apiFetch(`/api/admin/reports/comments/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      if (resp && resp.message) alert(resp.message);
      await initAdmin();
    });
  });
}

async function initEditProfile() {
  const form = document.getElementById("edit-profile-form");
  if (!form) return;

  const me = await apiFetch("/api/auth/me");
  if (!me) return;

  form.username.value = me.user.username;
  form.email.value = me.user.email;
}

async function init() {
  document.querySelectorAll('a[href="login.html"].btn-logout').forEach((link) => {
    link.addEventListener("click", handleLogout);
  });

  const page = document.body.dataset.page;

  if (page === "home") {
    await initHome();
  }

  if (page === "categories") {
    await initCategories();
  }

  if (page === "profile") {
    await initProfile();
  }

  if (page === "topic") {
    await initTopicView();
  }

  if (page === "edit-topic") {
    await initEditTopic();
  }

  if (page === "admin") {
    await initAdmin();
  }

  if (page === "new-topic") {
    await initNewTopic();
  }

  if (page === "edit-profile") {
    await initEditProfile();
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        username: loginForm.usuario_login.value,
        password: loginForm.senha_login.value
      };
      const result = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (result) {
        window.location.href = "index.html";
      }
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        username: registerForm.usuario_cadastro.value,
        email: registerForm.email_cadastro.value,
        password: registerForm.senha_cadastro.value
      };
      const result = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (result) {
        window.location.href = "index.html";
      }
    });
  }

  const newTopicForm = document.getElementById("new-topic-form");
  if (newTopicForm) {
    newTopicForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        titulo_topico: newTopicForm.titulo_topico.value,
        categoria_topico: newTopicForm.categoria_topico.value,
        conteudo_topico: newTopicForm.conteudo_topico.value
      };
      const result = await apiFetch("/api/topics", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (result) {
        window.location.href = `exibir_topico.html?id=${result.id}`;
      }
    });
  }

  const editTopicForm = document.getElementById("edit-topic-form");
  if (editTopicForm) {
    editTopicForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const topicId = getQueryId();
      if (!topicId) return;
      const payload = {
        titulo_post: editTopicForm.titulo_post.value,
        categoria_post: editTopicForm.categoria_post.value,
        conteudo_post: editTopicForm.conteudo_post.value
      };
      const result = await apiFetch(`/api/topics/${topicId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      if (result) {
        window.location.href = `exibir_topico.html?id=${topicId}`;
      }
    });
  }

  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const topicId = getQueryId();
      if (!topicId) return;
      const payload = {
        conteudo_comentario: commentForm.conteudo_comentario.value
      };
      const result = await apiFetch(`/api/topics/${topicId}/comments`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (result) {
        commentForm.conteudo_comentario.value = '';
        
        const commentsResult = await apiFetch(`/api/topics/${topicId}/comments`);
        if (commentsResult) {
          const commentsList = document.getElementById("comments-list");
          const commentsTitle = document.getElementById("comments-title");
          const commentCount = document.getElementById("comment-count");
          
          commentsList.innerHTML = commentsResult.comments
            .map((comment) => {
              return `
                <div class=\"comentario-card\">
                  <p><strong>${comment.username}</strong> <small style=\"color: #888;\">${formatDate(comment.created_at)}</small></p>
                  <p>${comment.content}</p>
                  <button class=\"btn-denunciar\" data-comment-id=\"${comment.id}\">Denunciar</button>
                </div>
              `;
            })
            .join("");

          // Adiciona handler de clique para denúncia
          document.querySelectorAll('.btn-denunciar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              const commentId = btn.getAttribute('data-comment-id');
              const motivo = prompt('Descreva o motivo da denúncia:');
              if (!motivo) return;
              // Chamada à API para denunciar comentário (endpoint será implementado)
              try {
                const resp = await apiFetch(`/api/comments/${commentId}/report`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                  body: JSON.stringify({ reason: motivo })
                });
                if (resp && resp.success) {
                  alert('Comentário denunciado com sucesso!');
                } else {
                  alert(resp && resp.message ? resp.message : 'Erro ao denunciar comentário.');
                }
              } catch (err) {
                alert('Erro ao denunciar comentário.');
              }
            });
          });
          
          const newCount = commentsResult.comments.length;
          commentsTitle.textContent = `Comentários (${newCount})`;
          commentCount.textContent = newCount;
          
          commentsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  const likeButton = document.getElementById("like-button");
  if (likeButton) {
    likeButton.addEventListener("click", async () => {
      const topicId = getQueryId();
      if (!topicId) return;
      const result = await apiFetch(`/api/topics/${topicId}/like`, {
        method: "POST"
      });
      if (result) {
        window.location.reload();
      }
    });
  }

  const editProfileForm = document.getElementById("edit-profile-form");
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(editProfileForm);
      const result = await apiFetch("/api/users/me", {
        method: "POST",
        body: formData
      });
      if (result) {
        window.location.href = "perfil.html";
      }
    });
  }

  const deleteAccount = document.getElementById("delete-account");
  if (deleteAccount) {
    deleteAccount.addEventListener("click", async () => {
      if (!confirm("Tem certeza que deseja excluir sua conta?")) return;
      const result = await apiFetch("/api/users/me", { method: "DELETE" });
      if (result) {
        window.location.href = "login.html";
      }
    });
  }

  const adminCategoryForm = document.getElementById("admin-category-form");
  if (adminCategoryForm) {
    adminCategoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = {
        name: adminCategoryForm.nome_nova_categoria.value
      };
      const result = await apiFetch("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (result) {
        window.location.reload();
      }
    });
  }

  document.body.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-category]");
    const deleteButton = event.target.closest("[data-delete-category]");
    const reportAction = event.target.closest("[data-report-action]");

    if (editButton) {
      const categoryId = editButton.dataset.editCategory;
      const name = prompt("Novo nome da categoria:");
      if (!name) return;
      const result = await apiFetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        body: JSON.stringify({ name })
      });
      if (result) {
        window.location.reload();
      }
    }

    if (deleteButton) {
      const categoryId = deleteButton.dataset.deleteCategory;
      if (!confirm("Excluir esta categoria?")) return;
      const result = await apiFetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE"
      });
      if (result) {
        window.location.reload();
      }
    }

    if (reportAction) {
      const reportId = reportAction.dataset.reportId;
      const action = reportAction.dataset.reportAction;
      const result = await apiFetch(`/api/admin/reports/${reportId}/resolve`, {
        method: "POST",
        body: JSON.stringify({ action })
      });
      if (result) {
        window.location.reload();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
