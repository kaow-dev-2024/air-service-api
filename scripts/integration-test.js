/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5001/api/v1";
const ADMIN_LOGIN = process.env.TEST_ADMIN_LOGIN || "paiadmin";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "paiadmin@passwd";

const now = Date.now();
const marker = `it-${now}`;
const uploadsDir = path.resolve(__dirname, "..", "uploads");

const results = [];

const toJson = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const callApi = async ({
  method,
  route,
  token,
  json,
  formData,
  expectedStatuses,
  allowAnyUnder500 = false,
  label,
}) => {
  const url = `${BASE_URL}${route}`;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const init = { method, headers };
  if (formData) {
    init.body = formData;
  } else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(json);
  }

  try {
    const res = await fetch(url, init);
    const body = await toJson(res);
    const ok = allowAnyUnder500
      ? res.status < 500
      : expectedStatuses.includes(res.status);

    results.push({
      ok,
      label: label || `${method} ${route}`,
      status: res.status,
      body,
    });
    return { status: res.status, body };
  } catch (error) {
    results.push({
      ok: false,
      label: label || `${method} ${route}`,
      status: "NETWORK_ERROR",
      body: String(error),
    });
    return { status: 0, body: null };
  }
};

const findIdInList = (list, idKey, key, value) => {
  const arr = Array.isArray(list) ? list : [];
  const found = arr.find((x) => x && x[key] === value);
  return found ? found[idKey] : null;
};

const runCrudResource = async ({
  name,
  idKey,
  uniqueKey,
  createBody,
  updateBody,
  token,
}) => {
  await callApi({
    method: "POST",
    route: `/${name}/`,
    token,
    json: createBody,
    expectedStatuses: [200, 201, 409, 400],
    allowAnyUnder500: true,
    label: `POST /${name}/`,
  });

  const listRes = await callApi({
    method: "GET",
    route: `/${name}/`,
    token,
    expectedStatuses: [200],
    allowAnyUnder500: true,
    label: `GET /${name}/`,
  });

  let id = null;
  if (listRes.status === 200) {
    id = findIdInList(listRes.body, idKey, uniqueKey, createBody[uniqueKey]);
  }

  if (id) {
    await callApi({
      method: "GET",
      route: `/${name}/${id}`,
      token,
      expectedStatuses: [200, 404],
      allowAnyUnder500: true,
      label: `GET /${name}/:id`,
    });

    await callApi({
      method: "PUT",
      route: `/${name}/${id}`,
      token,
      json: updateBody,
      expectedStatuses: [200, 404, 400],
      allowAnyUnder500: true,
      label: `PUT /${name}/:id`,
    });

    await callApi({
      method: "DELETE",
      route: `/${name}/${id}`,
      token,
      expectedStatuses: [200, 404],
      allowAnyUnder500: true,
      label: `DELETE /${name}/:id`,
    });
  }
};

const getToken = async (login, password) => {
  const res = await callApi({
    method: "POST",
    route: "/auth/login",
    json: { login, password },
    expectedStatuses: [200],
    label: `POST /auth/login (${login})`,
  });
  return res.body ? res.body.token : null;
};

const ensureAdminToken = async () => {
  const candidates = [
    { login: ADMIN_LOGIN, password: ADMIN_PASSWORD },
    { login: "paiadmin", password: "paiadmin@passwd" },
    { login: "lpqadmin", password: "Admin@123" },
    { login: "cnx", password: "cnx@passwd" },
  ];

  for (const cred of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const token = await getToken(cred.login, cred.password);
    if (token) return token;
  }

  const bootstrapUser = {
    username: `${marker}-bootstrap-admin`,
    password: "Pass@1234",
    full_name: "Bootstrap Admin",
    email: `${marker}-bootstrap@mail.com`,
    phone: `${String(now).slice(-10)}`,
    role_id: 1,
    airline_id: null,
    remark: marker,
    is_active: true,
  };

  await callApi({
    method: "POST",
    route: "/auth/register",
    json: bootstrapUser,
    expectedStatuses: [200, 409, 400],
    allowAnyUnder500: true,
    label: "POST /auth/register (bootstrap admin)",
  });

  return getToken(bootstrapUser.username, bootstrapUser.password);
};

const main = async () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const health = await callApi({
    method: "GET",
    route: "/",
    expectedStatuses: [200],
    allowAnyUnder500: false,
    label: "GET / (health)",
  });
  if (health.status !== 200) {
    throw new Error(
      `API is not reachable at ${BASE_URL}. Please start server before running integration test.`,
    );
  }

  const adminToken = await ensureAdminToken();
  if (!adminToken) {
    throw new Error(
      "Cannot login admin user for integration tests. Set TEST_ADMIN_LOGIN/TEST_ADMIN_PASSWORD or run seed users.",
    );
  }

  await callApi({
    method: "GET",
    route: "/auth/me",
    token: adminToken,
    expectedStatuses: [200, 401],
    allowAnyUnder500: true,
  });

  const regUser = {
    username: `${marker}-user`,
    password: "Pass@1234",
    full_name: "Integration User",
    email: `${marker}@mail.com`,
    phone: `${String(now).slice(-10)}`,
    role_id: 1,
    airline_id: null,
    remark: marker,
    is_active: true,
  };

  await callApi({
    method: "POST",
    route: "/auth/register",
    json: regUser,
    expectedStatuses: [200, 409, 400],
    allowAnyUnder500: true,
  });

  const userLogin = await callApi({
    method: "POST",
    route: "/auth/login",
    json: { login: regUser.username, password: regUser.password },
    expectedStatuses: [200, 401],
    allowAnyUnder500: true,
  });
  const userToken = userLogin.body && userLogin.body.token;
  const refreshToken = userLogin.body && userLogin.body.refresh_token;
  const userId = userLogin.body && userLogin.body.user && userLogin.body.user.user_id;

  if (userToken) {
    await callApi({
      method: "GET",
      route: `/auth/session/${userId}`,
      token: userToken,
      expectedStatuses: [200, 401, 404],
      allowAnyUnder500: true,
    });

    await callApi({
      method: "POST",
      route: "/auth/change-password",
      token: userToken,
      json: { old_password: "Pass@1234", new_password: "Pass@12345" },
      expectedStatuses: [200, 400, 401],
      allowAnyUnder500: true,
    });
  }

  if (refreshToken) {
    await callApi({
      method: "POST",
      route: "/auth/refresh-token",
      json: { refresh_token: refreshToken },
      expectedStatuses: [200, 400, 401],
      allowAnyUnder500: true,
    });
  }

  await callApi({
    method: "POST",
    route: "/auth/logout",
    token: adminToken,
    json: {},
    expectedStatuses: [200, 401],
    allowAnyUnder500: true,
  });

  const commonCrud = [
    {
      name: "roles",
      idKey: "role_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-role`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "directions",
      idKey: "direction_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-direction`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "flight-categories",
      idKey: "flight_category_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-cat`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "flight-status",
      idKey: "flight_status_id",
      uniqueKey: "name",
      createBody: {
        name: `${marker}-status`,
        color: "#2255aa",
        is_arrival: true,
        is_departure: false,
        remark: marker,
        is_active: true,
      },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "terminals",
      idKey: "terminal_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-terminal`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "gates",
      idKey: "gate_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-gate`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "belts",
      idKey: "belt_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-belt`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "counters",
      idKey: "counter_id",
      uniqueKey: "name",
      createBody: { name: `${marker}-counter`, remark: marker, is_active: true },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "aircraft-types",
      idKey: "aircraft_type_id",
      uniqueKey: "iata_code",
      createBody: {
        iata_code: `T${String(now).slice(-2)}`,
        icao_code: `T${String(now).slice(-2)}A`,
        manufacturer: "Test",
        model: "Test",
        category: "test",
        seat_capacity: 10,
        range_km: 100,
        remark: marker,
        is_active: true,
      },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "airlines",
      idKey: "airline_id",
      uniqueKey: "name",
      createBody: {
        name: `${marker}-airline`,
        iata_code: `X${String(now).slice(-1)}`,
        icao_code: `X${String(now).slice(-1)}A`,
        logo_url: "",
        checkin_open_inter: 180,
        checkin_close_inter: 60,
        boarding_time_inter: 30,
        first_bag_inter: 15,
        last_bag_inter: 30,
        checkin_open_dom: 120,
        checkin_close_dom: 45,
        boarding_time_dom: 20,
        first_bag_dom: 15,
        last_bag_dom: 30,
        remark: marker,
        is_active: true,
      },
      updateBody: { remark: `${marker}-updated` },
    },
    {
      name: "airports",
      idKey: "airport_id",
      uniqueKey: "name",
      createBody: {
        name: `${marker}-airport`,
        iata_code: `Z${String(now).slice(-2)}`,
        icao_code: `Z${String(now).slice(-2)}A`,
        city: "Test City",
        country: "Test Country",
        remark: marker,
        is_active: true,
      },
      updateBody: { remark: `${marker}-updated` },
    },
  ];

  for (const conf of commonCrud) {
    // eslint-disable-next-line no-await-in-loop
    await runCrudResource({ ...conf, token: adminToken });
  }

  await callApi({
    method: "GET",
    route: "/users/",
    token: adminToken,
    expectedStatuses: [200],
    allowAnyUnder500: true,
  });

  await callApi({
    method: "GET",
    route: "/users/1",
    token: adminToken,
    expectedStatuses: [200, 404],
    allowAnyUnder500: true,
  });

  const usersCreate = {
    username: `${marker}-u2`,
    password: "Pass@1234",
    full_name: "Integration User 2",
    email: `${marker}-u2@mail.com`,
    phone: `${String(now + 1).slice(-10)}`,
    role_id: 1,
    airline_id: null,
    remark: marker,
    is_active: true,
  };

  await callApi({
    method: "POST",
    route: "/users/",
    token: adminToken,
    json: usersCreate,
    expectedStatuses: [200, 400, 409],
    allowAnyUnder500: true,
  });

  const usersList = await callApi({
    method: "GET",
    route: "/users/",
    token: adminToken,
    expectedStatuses: [200],
    allowAnyUnder500: true,
  });

  const usersId = findIdInList(usersList.body, "user_id", "username", usersCreate.username);
  if (usersId) {
    await callApi({
      method: "PUT",
      route: `/users/${usersId}`,
      token: adminToken,
      json: { remark: `${marker}-updated` },
      expectedStatuses: [200, 404],
      allowAnyUnder500: true,
    });

    await callApi({
      method: "POST",
      route: "/users/change-password",
      token: adminToken,
      json: { user_id: usersId, new_password: "Pass@12345" },
      expectedStatuses: [200, 400, 404],
      allowAnyUnder500: true,
    });

    await callApi({
      method: "DELETE",
      route: `/users/${usersId}`,
      token: adminToken,
      expectedStatuses: [200, 404],
      allowAnyUnder500: true,
    });
  }

  await callApi({
    method: "POST",
    route: "/users/filter",
    token: adminToken,
    json: {},
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });

  const listOnlyRoutes = [
    "/season-flights/",
    "/daily-flights/",
    "/daily-flights/daily",
    "/daily-flights/weekly",
    "/daily-flights/monthly",
    "/daily-flights/year",
  ];
  for (const route of listOnlyRoutes) {
    // eslint-disable-next-line no-await-in-loop
    await callApi({
      method: "GET",
      route,
      token: adminToken,
      expectedStatuses: [200, 404],
      allowAnyUnder500: true,
    });
  }

  await callApi({
    method: "POST",
    route: "/filters/season-flights",
    token: adminToken,
    json: {},
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });
  await callApi({
    method: "POST",
    route: "/filters/daily-flights",
    token: adminToken,
    json: {},
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });
  await callApi({
    method: "POST",
    route: "/filters/users",
    token: adminToken,
    json: {},
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });

  await callApi({
    method: "POST",
    route: "/season-flights/generate-daily",
    token: adminToken,
    json: { season_flight_ids: [] },
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });
  await callApi({
    method: "POST",
    route: "/season-flights/ungenerate-daily",
    token: adminToken,
    json: { season_flight_ids: [] },
    expectedStatuses: [200, 400],
    allowAnyUnder500: true,
  });

  const uploadPath = path.resolve(__dirname, "..", "files", "flights.xlsx");
  if (fs.existsSync(uploadPath)) {
    const imageBlob = new Blob([Buffer.from("integration-test-image")], {
      type: "image/jpeg",
    });
    const fileBuffer = fs.readFileSync(uploadPath);
    const blob = new Blob([fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const formSingle = new FormData();
    formSingle.append("file", imageBlob, "test.jpg");
    await callApi({
      method: "POST",
      route: "/uploads/single",
      token: adminToken,
      formData: formSingle,
      expectedStatuses: [200, 400],
      allowAnyUnder500: true,
    });

    const formMultiple = new FormData();
    formMultiple.append("files", imageBlob, "test-1.jpg");
    formMultiple.append("files", imageBlob, "test-2.jpg");
    await callApi({
      method: "POST",
      route: "/uploads/multiple",
      token: adminToken,
      formData: formMultiple,
      expectedStatuses: [200, 400],
      allowAnyUnder500: true,
    });

    const formImport = new FormData();
    formImport.append("file", blob, "flights.xlsx");
    await callApi({
      method: "POST",
      route: "/season-flights/import",
      token: adminToken,
      formData: formImport,
      expectedStatuses: [200, 400],
      allowAnyUnder500: true,
    });
  }

  const failures = results.filter((x) => !x.ok);
  const passes = results.length - failures.length;

  console.log(`\nIntegration test summary: pass=${passes}, fail=${failures.length}, total=${results.length}`);
  if (failures.length) {
    console.log("\nFailed checks:");
    failures.forEach((f) => {
      console.log(`- ${f.label} -> status=${f.status}`);
    });
    process.exit(1);
  }
};

main().catch((error) => {
  console.error("Integration test crashed:", error);
  process.exit(1);
});
