function generateBoxShadow(n) {
    let value = `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    for (let i = 1; i < n; i++) {
      value += `, ${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`;
    }
    return value;
  }

  document.documentElement.style.setProperty('--shadows-small', generateBoxShadow(700));
  document.documentElement.style.setProperty('--shadows-medium', generateBoxShadow(200));
  document.documentElement.style.setProperty('--shadows-big', generateBoxShadow(100));

