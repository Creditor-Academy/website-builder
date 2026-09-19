export const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length > 1 && parts[1].length > 0) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0]?.[0] || '').toUpperCase();
};
