(function () {
  "use strict";

  const SUPABASE_URL = "https://dwneujmcyuwzmflqpqxf.supabase.co";
  const SUPABASE_KEY = "sb_publishable_B7sxIPezywUJNZM1YBilMQ_OSnCSxCp";
  const AUTH_STORAGE_KEY = "bm_tools_auth_v1";
  const BM_OS_RECOVERY_URL = "https://bm-ops-workspace.wise-mochi-2318.chatgpt.site/";
  const SCRIPT_BASE = document.currentScript ? document.currentScript.src : location.href;
  let client = null;

  if (window.supabase && typeof window.supabase.createClient === "function") {
    client = window.__BM_SUPABASE_CLIENT__ || window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storageKey: AUTH_STORAGE_KEY }
    });
    window.__BM_SUPABASE_CLIENT__ = client;
  }

  function recoveryParams() {
    try {
      return new URLSearchParams(location.hash.replace(/^#/, ""));
    } catch (error) {
      return new URLSearchParams();
    }
  }

  function forwardPasswordRecovery() {
    const params = recoveryParams();
    const query = new URLSearchParams(location.search);
    const isRecoveryHash = params.get("type") === "recovery" || params.has("error_code");
    if (!isRecoveryHash && !query.has("code")) return false;
    location.replace(`${BM_OS_RECOVERY_URL}${location.search}${location.hash}`);
    return true;
  }

  if (forwardPasswordRecovery()) return;

  window.__BM_AUTH_GATE_VERSION__ = "2026-07-18-supabase-signup";
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
      background: radial-gradient(circle at 50% 18%, #f8f6ff 0, #eef3f8 52%, #e9f0f5 100%);
      color: #0f172a;
      font-family: Inter, system-ui, "Microsoft YaHei", Arial, sans-serif;
    }
    .bm-auth-panel {
      width: min(430px, 100%);
      overflow: hidden;
      border: 1px solid #dbe3ef;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 24px 64px rgba(15, 23, 42, .14);
    }
    .bm-auth-heading {
      padding: 28px 30px 22px;
      border-bottom: 1px solid #e2e8f0;
    }
    .bm-auth-brand-row { display: flex; align-items: center; gap: 12px; }
    .bm-auth-logo {
      width: 42px;
      height: 42px;
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 12px;
      color: #ffffff;
      background: linear-gradient(135deg, #5b45e8, #7c3aed);
      font-weight: 900;
    }
    .bm-auth-brand {
      margin: 0;
      font-size: 23px;
      line-height: 1.25;
      font-weight: 850;
      letter-spacing: -.02em;
    }
    .bm-auth-subtitle {
      margin: 10px 0 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
    }
    .bm-auth-form {
      display: grid;
      gap: 15px;
      padding: 24px 30px 28px;
    }
    .bm-auth-field { display: grid; gap: 7px; }
    .bm-auth-label { color: #334155; font-size: 13px; font-weight: 750; }
    .bm-auth-input {
      width: 100%;
      height: 45px;
      padding: 0 13px;
      border: 1px solid #cbd5e1;
      border-radius: 9px;
      outline: none;
      background: #ffffff;
      color: #0f172a;
      font: inherit;
    }
    .bm-auth-input:focus {
      border-color: #5b45e8;
      box-shadow: 0 0 0 3px rgba(91, 69, 232, .12);
    }
    .bm-auth-error {
      min-height: 20px;
      margin: -3px 0 0;
      color: #64748b;
      font-size: 13px;
      line-height: 1.5;
    }
    .bm-auth-error.is-error { color: #dc2626; }
    .bm-auth-error.is-success { color: #15803d; }
    .bm-auth-actions { display: grid; grid-template-columns: 1fr; gap: 9px; }
    .bm-auth-submit {
      height: 44px;
      border-radius: 9px;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .bm-auth-submit { border: 0; color: #ffffff; background: #5b45e8; }
    .bm-auth-submit:hover { background: #4f3bd1; }
    .bm-auth-submit:disabled { cursor: wait; opacity: .65; }
    .bm-auth-help {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: #8a98a8;
      font-size: 12px;
    }
    .bm-auth-reset { padding: 0; border: 0; color: #5b45e8; background: transparent; font: inherit; font-weight: 750; cursor: pointer; }
    #bm-auth-logout {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483000;
      height: 36px;
      padding: 0 14px;
      border: 1px solid #dbe3ef;
      border-radius: 8px;
      background: rgba(255, 255, 255, .96);
      color: #475569;
      box-shadow: 0 8px 24px rgba(15, 23, 42, .1);
      font: 700 13px/1 Inter, system-ui, "Microsoft YaHei", Arial, sans-serif;
      cursor: pointer;
    }
    #bm-auth-logout:hover { border-color: #ef4444; color: #dc2626; }
    @media (max-width: 480px) {
      #bm-auth-gate { padding: 14px; }
      .bm-auth-heading, .bm-auth-form { padding-left: 22px; padding-right: 22px; }
      .bm-auth-actions { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  function loadSupabaseLibrary() {
    if (window.supabase && typeof window.supabase.createClient === "function") return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("supabase-umd.js", SCRIPT_BASE).href;
      script.onload = resolve;
      script.onerror = () => reject(new Error("登录组件加载失败，请检查网络后刷新页面。"));
      document.head.appendChild(script);
    });
  }

  async function getClient() {
    if (client) return client;
    await loadSupabaseLibrary();
    if (!window.supabase || typeof window.supabase.createClient !== "function") throw new Error("登录组件加载失败，请刷新页面。 ");
    client = window.__BM_SUPABASE_CLIENT__ || window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storageKey: AUTH_STORAGE_KEY }
    });
    window.__BM_SUPABASE_CLIENT__ = client;
    return client;
  }

  function setMessage(message, kind) {
    const target = document.querySelector(".bm-auth-error");
    if (!target) return;
    target.textContent = message;
    target.classList.toggle("is-error", kind === "error");
    target.classList.toggle("is-success", kind === "success");
  }

  function setBusy(busy) {
    document.querySelectorAll(".bm-auth-submit,.bm-auth-reset").forEach(button => {
      button.disabled = busy;
    });
  }

  function addLogoutButton() {
    if (document.getElementById("bm-auth-logout")) return;
    const button = document.createElement("button");
    button.id = "bm-auth-logout";
    button.type = "button";
    button.textContent = "退出登录";
    button.title = "退出当前 BM 账号";
    button.addEventListener("click", async function () {
      button.disabled = true;
      try {
        const sb = await getClient();
        await sb.auth.signOut();
      } finally {
        location.reload();
      }
    });
    document.body.appendChild(button);
  }

  function unlock() {
    delete document.documentElement.dataset.bmAuth;
    const gate = document.getElementById("bm-auth-gate");
    if (gate) gate.remove();
    addLogoutButton();
  }

  function lock() {
    document.documentElement.dataset.bmAuth = "locked";
    let gate = document.getElementById("bm-auth-gate");
    if (gate) return gate;
    gate = document.createElement("div");
    gate.id = "bm-auth-gate";
    gate.innerHTML = `
      <section class="bm-auth-panel" aria-labelledby="bm-auth-title">
        <div class="bm-auth-heading">
          <div class="bm-auth-brand-row"><span class="bm-auth-logo">BM</span><h1 class="bm-auth-brand" id="bm-auth-title">BM 运营工具中心</h1></div>
          <p class="bm-auth-subtitle">仅限已开通的内部账号登录老工具箱。</p>
        </div>
        <form class="bm-auth-form" autocomplete="on">
          <label class="bm-auth-field">
            <span class="bm-auth-label">邮箱</span>
            <input class="bm-auth-input" name="email" type="email" autocomplete="email" placeholder="name@company.com" required autofocus>
          </label>
          <label class="bm-auth-field">
            <span class="bm-auth-label">密码</span>
            <input class="bm-auth-input" name="password" type="password" autocomplete="current-password" minlength="6" placeholder="至少 6 位" required>
          </label>
          <p class="bm-auth-error" role="status" aria-live="polite">正在连接账号服务…</p>
          <div class="bm-auth-actions">
            <button class="bm-auth-submit" type="submit">登录</button>
          </div>
          <div class="bm-auth-help"><span>新账号由管理员统一开通</span><button class="bm-auth-reset" type="button">忘记密码？</button></div>
        </form>
      </section>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const reset = gate.querySelector(".bm-auth-reset");

    async function credentials() {
      const email = form.elements.email.value.trim();
      const password = form.elements.password.value;
      if (!email || !password) {
        setMessage("请输入邮箱和密码。", "error");
        return null;
      }
      if (password.length < 6) {
        setMessage("密码至少需要 6 位。", "error");
        return null;
      }
      return { email, password };
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const values = await credentials();
      if (!values) return;
      setBusy(true);
      setMessage("正在登录…");
      try {
        const sb = await getClient();
        const { data, error } = await sb.auth.signInWithPassword(values);
        if (error) throw error;
        if (!data.session) throw new Error("登录未完成，请稍后重试。");
        unlock();
      } catch (error) {
        setMessage(`登录失败：${error.message || "请检查邮箱和密码。"}`, "error");
      } finally {
        setBusy(false);
      }
    });

    reset.addEventListener("click", async function () {
      const email = form.elements.email.value.trim();
      if (!email) return setMessage("请先填写需要重置密码的邮箱。", "error");
      setBusy(true);
      setMessage("正在发送重置邮件…");
      try {
        const sb = await getClient();
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
        if (error) throw error;
        setMessage("重置邮件已发送，请打开邮箱里的链接。", "success");
      } catch (error) {
        setMessage(`发送失败：${error.message || "请稍后重试。"}`, "error");
      } finally {
        setBusy(false);
      }
    });
    return gate;
  }

  async function initialize() {
    lock();
    try {
      const sb = await getClient();
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      sb.auth.onAuthStateChange((event, session) => {
        if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) unlock();
      });
      if (data.session) unlock();
      else setMessage("请输入管理员已开通的账号。", "");
    } catch (error) {
      setMessage(error.message || "登录服务暂时不可用，请刷新页面重试。", "error");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
}());
