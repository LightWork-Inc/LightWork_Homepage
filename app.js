const dialog = document.querySelector('.info-dialog');
const title = document.querySelector('#dialog-title');
const copy = document.querySelector('#dialog-copy');
const messages = {
  about: ['더 중요한 일에 쓸 수 있도록.', '라이트워크는 사람들의 업무 시간을 돌려주는 것을 목표로 합니다. 민원 업무에서 시작해, 사람들이 더 중요한 일에 집중할 수 있는 방법을 고민합니다.'],
  service: ['민원팩토리 연결 준비 중', '민원팩토리 서비스 연결을 준비하고 있습니다. 현재 이 페이지에서는 서비스 이용을 시작할 수 없습니다.'],
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

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const message = messages[button.dataset.dialog];
    if (!message || dialog.open || isClosing) return;
    dialog.dataset.dialog = button.dataset.dialog;
    title.textContent = message[0];
    copy.textContent = message[1];
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

document.querySelectorAll('.dialog-close, .dialog-confirm').forEach((button) => {
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
  document.body.classList.remove('dialog-open');
  lastTrigger?.focus({ preventScroll: true });
});
// Keep keyboard navigation within the native modal and return focus on close.
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const first = dialog.querySelector('.dialog-close');
  const last = dialog.querySelector('.dialog-confirm');
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
