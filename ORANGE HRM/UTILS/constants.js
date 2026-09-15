const DEFAULT_UI_URL = 'https://opensource-demo.orangehrmlive.com';
const DEFAULT_API_URL = 'https://dummyjson.com';

const environments = {
  demo: {
    uiBaseUrl: DEFAULT_UI_URL,
    apiBaseUrl: DEFAULT_API_URL,
  },
  qa: {
    uiBaseUrl: process.env.QA_BASE_URL || DEFAULT_UI_URL,
    apiBaseUrl: process.env.QA_API_BASE_URL || DEFAULT_API_URL,
  },
  staging: {
    uiBaseUrl: process.env.STAGING_BASE_URL || DEFAULT_UI_URL,
    apiBaseUrl: process.env.STAGING_API_BASE_URL || DEFAULT_API_URL,
  },
};

function getEnvironmentConfig(environmentName = 'demo') {
  const normalizedName = environmentName.toLowerCase();
  if (!environments[normalizedName]) {
    throw new Error(
      `Unsupported ENV "${environmentName}". Supported values: ${Object.keys(environments).join(', ')}`
    );
  }
  return environments[normalizedName];
}

const routes = {
  login: '/web/index.php/auth/login',
  dashboard: '/web/index.php/dashboard/index',
  pim: '/web/index.php/pim/viewEmployeeList',
  admin: '/web/index.php/admin/viewSystemUsers',
};

const api = {
  baseUrl: process.env.API_BASE_URL || DEFAULT_API_URL,
  users: '/users',
  addUser: '/users/add',
  authLogin: '/auth/login',
  authMe: '/auth/me',
};

module.exports = {
  DEFAULT_UI_URL,
  DEFAULT_API_URL,
  environments,
  getEnvironmentConfig,
  routes,
  api,
};
