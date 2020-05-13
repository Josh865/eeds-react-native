const menuItemIconMap = {
  'Enter Self-Declared Activity': 'edit-2-outline',
  'Take Evaluation Survey': 'list-outline',
  'View Attendance Report': 'file-text-outline',
  'View CE Calendar': 'calendar-outline',
  'Access Course Materials': 'book-outline',
  'Register for Symposium': 'checkmark-circle-outline',
};

const getIconForMenuItem = menuItem => {
  const icon = menuItemIconMap[menuItem];

  if (!icon) {
    return 'square-outline';
  }

  return icon;
};

export default getIconForMenuItem;
