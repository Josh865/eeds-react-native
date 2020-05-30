const currentHour = new Date().getHours();

let timeOfDay;

if (currentHour < 12) {
  timeOfDay = 'Morning';
} else if (currentHour >= 12 && currentHour <= 17) {
  timeOfDay = 'Afternoon';
} else {
  timeOfDay = 'Evening';
}

export default timeOfDay;
