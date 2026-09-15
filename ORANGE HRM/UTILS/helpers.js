function uniqueSuffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}

function generateEmployee(overrides = {}) {
  const suffix = uniqueSuffix().replace(/-/g, '').slice(-8);
  return {
    firstName: `Auto${suffix.slice(0, 4)}`,
    middleName: 'QA',
    lastName: `User${suffix.slice(4)}`,
    ...overrides,
  };
}

function generateSystemUser(overrides = {}) {
  const suffix = uniqueSuffix().replace(/-/g, '');
  return {
    username: `qa_${suffix}`.slice(0, 35),
    password: `Pw!${suffix}Aa`,
    role: 'ESS',
    status: 'Enabled',
    ...overrides,
  };
}

async function measureResponseTime(requestFunction) {
  const startedAt = Date.now();
  const response = await requestFunction();
  const durationMs = Date.now() - startedAt;
  return { response, durationMs };
}

function buildFullName(employee) {
  return [employee.firstName, employee.middleName, employee.lastName]
    .filter(Boolean)
    .join(' ');
}

module.exports = {
  uniqueSuffix,
  generateEmployee,
  generateSystemUser,
  measureResponseTime,
  buildFullName,
};
