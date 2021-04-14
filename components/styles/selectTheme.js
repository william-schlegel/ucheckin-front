export default function selectTheme(theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'var(--primary)',
      primary25: 'var(--secondary)',
      neutral0: 'var(--background)',
      neutral5: 'var(--background)',
      neutral10: 'var(--background-light)',
      neutral70: 'var(--text-color)',
      neutral80: 'var(--text-color)',
      neutral90: 'var(--text-color)',
    },
  };
}
