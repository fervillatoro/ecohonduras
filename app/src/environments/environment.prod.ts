

export const environment = {
  production: true,
  domain: 'localhost:8100',

  app:  {
    versionName: '1.0.',
    versionCode: 0
  },

  api: {
    version: 'NOT_APPLY',
    publicKey: 'NOT_APPLY',
    domain: `NOT_APPLY`,
    maxSessionDurationInDays: 7,
    get uriRequest () {
      return `${this.domain}/${this.version}/public`;
    },
    get url() {
      const mainImagesURL = `${this.domain}/uploads/img/`;
      
      return {
        uploads: {
          /**
           * @deprecated since V1.1.0 - Use `images.main` instead.
          */
          img:   `${this.domain}/uploads/img/`,
          /**
           * @deprecated since V1.1.0 - Use `images.events` instead.
          */
          events: `${this.domain}/uploads/img/events/`,



          images: {
            main:   mainImagesURL,
            events: `${mainImagesURL}events/`,
            users: {
              profile: `${mainImagesURL}users/profile/`,
              dni:     `${mainImagesURL}users/dni/`,
            }
          },
        },
        staticAssets: {
          img: `${this.domain}/static/img/`,
          logo: `${this.domain}/static/img/logo/logo.png`,
          logoLight: `${this.domain}/static/img/logo/logo-light.png`,
          logoDark: `${this.domain}/static/img/logo/logo-dark.png`,
          logoLetters: `${this.domain}/static/img/logo/logo-letters.png`,

          banners: `${this.domain}/static/img/banners/`,
          icons: `${this.domain}/static/img/icons/`,
          iconsProfessions: `${this.domain}/static/img/icons/professions/`,
        },
      }
    },
  },

  stripe: {
    publicKey: "pk_test_51PhJCjIM4GtrHrUoUwtzkxIHoXCiI5kQA7IIiUjkdl8g6asFhC2cm9yGVEzqnEKhESkHvsJo9UDkFpu4ekbKdErd00X2WSk8Iw"
  },
  
  google: {
    mapsAPIKey: "AIzaSyCQDdmwwzJLyYUfQYVe8nATBvItjxLF450"
  },
  firebaseConfig: {
    apiKey: "AIzaSyCQYmnDqvtzWmclaO4Hf8ucuAJ36LfDFoc",
    authDomain: "ecohonduras-sen.firebaseapp.com",
    projectId: "ecohonduras-sen",
    storageBucket: "ecohonduras-sen.appspot.com",
    messagingSenderId: "713934540959",
    appId: "1:713934540959:web:2aa4772fe25e63309e52aa",
    measurementId: "G-5208SZFGN9"
  }
};
