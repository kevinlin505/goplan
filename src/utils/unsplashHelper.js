const unsplashHelper = {
  apiUrl: (accessToken, query) => {
    return `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${accessToken}&orientation=landscape`;
  },
  imageUrl: (sourceUrl, sizeParam = '&w=600&h=300') => {
    return `${sourceUrl}${sizeParam}`;
  },
};

export default unsplashHelper;
