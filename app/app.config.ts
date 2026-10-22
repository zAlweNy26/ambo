export default defineAppConfig({
  title: 'Ambo!',
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'orange',
      neutral: 'stone',
    },
    icons: {
      arrowLeft: 'i-tabler-arrow-left',
      arrowRight: 'i-tabler-arrow-right',
      chevronDoubleLeft: 'i-tabler-chevrons-left',
      chevronDoubleRight: 'i-tabler-chevrons-right',
      chevronUp: 'i-tabler-chevron-up',
      chevronDown: 'i-tabler-chevron-down',
      chevronLeft: 'i-tabler-chevron-left',
      chevronRight: 'i-tabler-chevron-right',
      check: 'i-tabler-check',
      close: 'i-tabler-x',
      ellipsis: 'i-tabler-dots',
      external: 'i-tabler-arrow-up-right',
      loading: 'i-tabler-refresh',
      search: 'i-tabler-search',
      minus: 'i-tabler-minus',
      plus: 'i-tabler-plus',
    },
    button: {
      slots: {
        base: 'cursor-pointer transition-all font-semibold',
      },
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        // Black ink on orange paint: white on orange fails contrast
        class: 'text-ink border-[3px] border-ink hover:bg-primary-300 disabled:bg-primary-200 aria-disabled:bg-primary-200 dark:border-black',
      }],
    },
    modal: {
      slots: {
        content: 'ring-0 border-[3px] border-ink dark:border-default',
        title: 'font-display text-2xl font-normal',
      },
    },
    card: {
      slots: {
        header: 'p-2 sm:p-4',
        body: 'p-2 sm:p-4',
        footer: 'p-2 sm:p-4',
      },
    },
  },
})
