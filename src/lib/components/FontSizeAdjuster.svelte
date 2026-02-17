<script>
  import { fontSize } from '$lib/stores/fontSizeStore';
  import { onMount } from 'svelte';

  let isOpen = false;
  let displaySize = '100%';

  onMount(() => {
    // Subscribe to font size changes
    fontSize.subscribe(size => {
      displaySize = Math.round(size * 100) + '%';
      // Apply to DOM
      document.documentElement.style.setProperty('--font-size-multiplier', size.toString());
    });

    // Set initial value
    document.documentElement.style.setProperty('--font-size-multiplier', $fontSize.toString());

    // Keyboard shortcuts
    const handleKeydown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          fontSize.increase();
        } else if (e.key === '-') {
          e.preventDefault();
          fontSize.decrease();
        } else if (e.key === '0') {
          e.preventDefault();
          fontSize.reset();
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function handleIncrease() {
    fontSize.increase();
  }

  function handleDecrease() {
    fontSize.decrease();
  }

  function handleReset() {
    fontSize.reset();
  }

  function toggleMenu() {
    isOpen = !isOpen;
  }
</script>

<div class="font-size-adjuster">
  <button
    class="adjuster-toggle"
    on:click={toggleMenu}
    title="Adjust font size (Ctrl +/-/0)"
    aria-label="Font size controls"
    aria-expanded={isOpen}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 12h18M3 6h18M3 18h18"/>
      <circle cx="6" cy="12" r="1" fill="currentColor"/>
      <circle cx="18" cy="12" r="1" fill="currentColor"/>
    </svg>
    <span class="size-display">{displaySize}</span>
  </button>

  {#if isOpen}
    <div class="adjuster-menu" role="region" aria-label="Font size adjustment controls">
      <button
        class="control-btn decrease-btn"
        on:click={handleDecrease}
        title="Decrease font size (Ctrl -)"
        aria-label="Decrease font size"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <text x="4" y="18" font-size="20" font-weight="bold">A</text>
        </svg>
        <span>−</span>
      </button>

      <div class="size-indicator">
        <div class="size-label">Text Size</div>
        <div class="size-value">{displaySize}</div>
        <div class="size-bar">
          <div class="size-fill" style="width: {(($fontSize - 0.75) / (1.5 - 0.75)) * 100}%"></div>
        </div>
      </div>

      <button
        class="control-btn increase-btn"
        on:click={handleIncrease}
        title="Increase font size (Ctrl +)"
        aria-label="Increase font size"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <text x="2" y="18" font-size="24" font-weight="bold">A</text>
        </svg>
        <span>+</span>
      </button>

      <button
        class="control-btn reset-btn"
        on:click={handleReset}
        title="Reset font size to default"
        aria-label="Reset font size"
      >
        Reset
      </button>
    </div>
  {/if}
</div>

<style>
  .font-size-adjuster {
    position: relative;
  }

  .adjuster-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    color: var(--color-foreground);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .adjuster-toggle:hover {
    background: var(--color-border);
    border-color: var(--color-primary);
  }

  .size-display {
    font-weight: 600;
    color: var(--color-primary);
    min-width: 2.5rem;
    text-align: right;
  }

  .adjuster-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    padding: 1rem;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 200px;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    color: var(--color-foreground);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .control-btn:hover {
    background: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
  }

  .decrease-btn {
    margin-bottom: 0.75rem;
  }

  .increase-btn {
    margin-bottom: 0.75rem;
  }

  .size-indicator {
    margin-bottom: 0.75rem;
    text-align: center;
  }

  .size-label {
    font-size: 0.75rem;
    color: var(--color-muted);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .size-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .size-bar {
    width: 100%;
    height: 6px;
    background: var(--color-background);
    border-radius: 3px;
    overflow: hidden;
  }

  .size-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    transition: width 0.3s ease;
  }

  .reset-btn {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
</style>
