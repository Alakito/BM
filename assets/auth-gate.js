(function () {
  "use strict";

  const SESSION_KEY = "bmToolboxAuthSessionV1";
  const SESSION_VALUE = "bm-admin-session-2026";
  const ALLOWED_USERNAME = "admin";
  const PASSWORD_SHA256 = "13b1b3589dcaa18e3eaaf6cad939a90a7e963fffe2b8cd9ce078687dff2cf470";
  const BM_OS_RECOVERY_URL = "https://bm-ops-workspace.wise-mochi-2318.chatgpt.site/";

  function recoveryParams() {
    try {
      return new URLSearchParams(location.hash.replace(/^#/, ""));
    } catch (error) {
      return new URLSearchParams();
    }
  }

  function forwardPasswordRecovery() {
    const params = recoveryParams();
    if (params.get("type") !== "recovery" || !params.get("access_token")) return false;
    location.replace(`${BM_OS_RECOVERY_URL}${location.hash}`);
    return true;
  }

  if (forwardPasswordRecovery()) return;

  window.__BM_AUTH_GATE_VERSION__ = "2026-07-12";
  document.documentElement.dataset.bmAuth = "pending";

  const style = document.createElement("style");
  style.textContent = `
    html[data-bm-auth="pending"] body > *,
    html[data-bm-auth="locked"] body > *:not(#bm-auth-gate) {
      visibility: hidden !important;
      pointer-events: none !important;
    }
    html[data-bm-auth="pending"] body,
    html[data-bm-auth="locked"] body { overflow: hidden !important; }
    #bm-auth-gate {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      visibility: visible !important;
      pointer-events: auto !important;
      padding: 24px;
      background: #eef3f8;
      color: #0f172a;
      font-family: Inter, system-ui, "Microsoft YaHei", Arial, sans-serif;
    }
    .bm-auth-panel {
      width: min(420px, 100%);
      overflow: hidden;
      border: 1px solid #dbe3ef;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 24px 64px rgba(15, 23, 42, .14);
    }
    .bm-auth-heading {
      padding: 26px 28px 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    .bm-auth-brand {
      margin: 0;
      font-size: 24px;
      line-height: 1.25;
      font-weight: 800;
      letter-spacing: 0;
    }
    .bm-auth-subtitle {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
    }
    .bm-auth-form {
      display: grid;
      gap: 16px;
      padding: 24px 28px 28px;
    }
    .bm-auth-field { display: grid; gap: 7px; }
    .bm-auth-label {
      color: #334155;
      font-size: 13px;
      font-weight: 700;
    }
    .bm-auth-input {
      width: 100%;
      height: 44px;
      padding: 0 13px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      outline: none;
      background: #ffffff;
      color: #0f172a;
      font: inherit;
      letter-spacing: 0;
    }
    .bm-auth-input:focus {
      border-color: #5b45e8;
      box-shadow: 0 0 0 3px rgba(91, 69, 232, .12);
    }
    .bm-auth-error {
      min-height: 20px;
      margin: -4px 0 0;
      color: #dc2626;
      font-size: 13px;
      line-height: 1.5;
    }
    .bm-auth-submit {
      width: 100%;
      height: 44px;
      border: 0;
      border-radius: 6px;
      background: #5b45e8;
      color: #ffffff;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .bm-auth-submit:hover { background: #4f3bd1; }
    .bm-auth-submit:disabled { cursor: wait; opacity: .7; }
    #bm-auth-logout {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483000;
      height: 36px;
      padding: 0 14px;
      border: 1px solid #dbe3ef;
      border-radius: 6px;
      background: rgba(255, 255, 255, .96);
      color: #475569;
      box-shadow: 0 8px 24px rgba(15, 23, 42, .1);
      font: 700 13px/1 Inter, system-ui, "Microsoft YaHei", Arial, sans-serif;
      letter-spacing: 0;
      cursor: pointer;
    }
    #bm-auth-logout:hover { border-color: #ef4444; color: #dc2626; }
  `;
  document.head.appendChild(style);

  function isAuthorized() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE;
    } catch (error) {
      return false;
    }
  }

  function addLogoutButton() {
    if (document.getElementById("bm-auth-logout")) return;
    const button = document.createElement("button");
    button.id = "bm-auth-logout";
    button.type = "button";
    button.textContent = "退出登录";
    button.title = "退出并锁定 BM 运营工具";
    button.addEventListener("click", function () {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch (error) {
        // Reloading still returns the page to the locked state when storage is unavailable.
      }
      location.reload();
    });
    document.body.appendChild(button);
  }

  function unlock() {
    delete document.documentElement.dataset.bmAuth;
    const gate = document.getElementById("bm-auth-gate");
    if (gate) gate.remove();
    addLogoutButton();
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function lock() {
    document.documentElement.dataset.bmAuth = "locked";
    const gate = document.createElement("div");
    gate.id = "bm-auth-gate";
    gate.innerHTML = `
      <section class="bm-auth-panel" aria-labelledby="bm-auth-title">
        <div class="bm-auth-heading">
          <h1 class="bm-auth-brand" id="bm-auth-title">BM 运营工具中心</h1>
          <p class="bm-auth-subtitle">请输入授权账号后进入运营工具。</p>
        </div>
        <form class="bm-auth-form" autocomplete="on">
          <label class="bm-auth-field">
            <span class="bm-auth-label">账号</span>
            <input class="bm-auth-input" name="username" type="text" autocomplete="username" required autofocus>
          </label>
          <label class="bm-auth-field">
            <span class="bm-auth-label">密码</span>
            <input class="bm-auth-input" name="password" type="password" autocomplete="current-password" required>
          </label>
          <p class="bm-auth-error" role="alert" aria-live="polite"></p>
          <button class="bm-auth-submit" type="submit">登录</button>
        </form>
      </section>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const error = gate.querySelector(".bm-auth-error");
    const submit = gate.querySelector(".bm-auth-submit");
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      error.textContent = "";
      submit.disabled = true;
      try {
        const username = form.elements.username.value.trim();
        const passwordHash = await sha256(form.elements.password.value);
        if (username === ALLOWED_USERNAME && passwordHash === PASSWORD_SHA256) {
          sessionStorage.setItem(SESSION_KEY, SESSION_VALUE);
          form.reset();
          unlock();
          return;
        }
        error.textContent = "账号或密码错误，请重新输入。";
        form.elements.password.value = "";
        form.elements.password.focus();
      } catch (authError) {
        error.textContent = "当前浏览器无法完成验证，请升级浏览器后重试。";
      } finally {
        submit.disabled = false;
      }
    });
  }

  function initialize() {
    const params = recoveryParams();
    if (params.get("type") === "recovery" || params.get("error_code")) unlock();
    else if (isAuthorized()) unlock();
    else lock();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
}());
