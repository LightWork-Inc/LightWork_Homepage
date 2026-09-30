// Keep motion, scroll locking and focus behavior consistent for every popup.
document.querySelectorAll('dialog').forEach((dialog) => {
  const isScreenshot = dialog.classList.contains('screenshot-dialog');
  const title = dialog.querySelector('#dialog-title');
  const copy = dialog.querySelector('#dialog-copy');
  const messages = {
    about: ['더 중요한 일에 쓸 수 있도록.', '라이트워크는 사람들의 업무 시간을 돌려주는 것을 목표로 합니다. 민원 업무에서 시작해, 사람들이 더 중요한 일에 집중할 수 있는 방법을 고민합니다.'],
  };
  let lastTrigger;
  let motion = null;
  let isClosing = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const shouldAnimate = () => !reducedMotion.matches;

  async function closeDialog() {
    if (!dialog.open || isClosing) return;
    isClosing = true;
    const currentStyle = getComputedStyle(dialog);
    const closingStart = { opacity: currentStyle.opacity, transform: currentStyle.transform };
    motion?.cancel();
    if (shouldAnimate()) {
      dialog.classList.add('is-closing');
      motion = dialog.animate(
        [closingStart, { opacity: 0, transform: 'translateY(8px) scale(.98)' }],
        { duration: 160, easing: 'ease-in', fill: 'forwards' },
      );
      try { await motion.finished; } catch { /* A motion preference change can cancel the animation. */ }
    }
    if (dialog.open) dialog.close();
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) motion?.cancel();
  });

  document.querySelectorAll(isScreenshot ? '[data-screenshot]' : 'button[data-dialog]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (document.querySelector('dialog[open]') || isClosing) return;
      if (isScreenshot) {
        setScreenshotZoom(false);
      } else {
        const message = messages[button.dataset.dialog];
        if (!message) return;
        dialog.dataset.dialog = button.dataset.dialog;
        title.textContent = message[0];
        copy.textContent = message[1];
      }
      lastTrigger = button;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      if (shouldAnimate()) {
        motion = dialog.animate(
          [{ opacity: 0, transform: 'translateY(14px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
          { duration: 240, easing: 'cubic-bezier(.2, .7, .2, 1)' },
        );
        motion.finished.catch(() => {});
      }
    });
  });

  dialog.querySelectorAll('.dialog-close, .dialog-confirm').forEach((button) => {
    button.addEventListener('click', closeDialog);
  });
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeDialog();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', () => {
    motion?.cancel();
    motion = null;
    isClosing = false;
    dialog.classList.remove('is-closing');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    lastTrigger?.focus({ preventScroll: true });
  });
  // Keep keyboard navigation within the native modal and return focus on close.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});

const screenshotDialog = document.querySelector('.screenshot-dialog');
const zoomButton = screenshotDialog.querySelector('.screenshot-zoom');
const screenshotViewport = screenshotDialog.querySelector('.screenshot-viewport');
function setScreenshotZoom(zoomed) {
  screenshotViewport.classList.toggle('is-zoomed', zoomed);
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? '화면에 맞추기' : '원본 크기로 확대';
  screenshotViewport.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
zoomButton.addEventListener('click', () => setScreenshotZoom(zoomButton.getAttribute('aria-pressed') !== 'true'));
