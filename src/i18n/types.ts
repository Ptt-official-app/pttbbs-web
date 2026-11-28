export type I18n = {
  header: {
    loginRegister: string;
    logout: string;
  };
  register: {
    title: string;
    emailAddress: string;
    registerAccount: string;
    info: string;
  };
  login: {
    // LoginPage
    login: string;
    register: string;
    forgotPassword: string;
    titlePrefix: string;
    titlePostfix: string;
    info: string;
    submit: string;
  };
  init: {
    // InitPage
    title: string;
    username: string;
    realName: string;
    birthDate: string;
    submit: string;
    errmsg: {
      noUsername: string;
    };
  };
  error: {
    // ErrorPage
    title: string;
    prompt: string;
    backHome: string;
  };
  profile: {
    // ProfilePage
    withMobileID: string;
    withGovernmentID: string;
  };
  errmsg: {
    usernameInvalidChars: string;
    usernameStartsWithDot: string;
    usernameEndsWithDot: string;
  };
};
