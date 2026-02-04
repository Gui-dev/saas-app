export const getInitialsName = (name: string): string => {
  if (!name.trim()) {
    return ''
  }

  const initials = name
    .trim()
    .split(/[\s\-_]+/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return initials
}
