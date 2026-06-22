const {
  SeasonFlight,
  DailyFlight,
  Airline,
  Airport,
  AircraftType,
  Direction,
  FlightCategory,
  Terminal,
  Belt,
  Gate,
} = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const moment = require("moment-timezone");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const find = async (req, res) => {
  try {
    const items = await SeasonFlight.findAll({
      // include: { all: true },
      include: [
        { model: Airport, as: "Origin", required: true },
        { model: Airport, as: "Destination", required: true },
        { model: Airline, required: true },
        { model: AircraftType, required: true },
        { model: Direction, required: true },
        { model: FlightCategory, required: true },
        { model: Terminal, required: true },
        { model: Belt, required: false },
        { model: Gate, required: false },
      ],
      order: [["season_flight_id", "ASC"]],
    });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await SeasonFlight.findOne({
      where: { season_flight_id: id },
      include: { all: true },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const create = async (req, res) => {
  const seasonFlightData = req.body;

  if (seasonFlightData.direction_id == 1) {
    seasonFlightData.gate_id = null;
    seasonFlightData.counters = [];
  }
  if (seasonFlightData.direction_id == 2) {
    seasonFlightData.belt_id = null;
  }

  let date = moment().format("YYYY-MM-DD");
  let stdUtc = moment
    .tz(
      `${date} ${seasonFlightData.std}`,
      "YYYY-MM-DD HH:mm",
      process.env.TIME_ZONE,
    )
    .utc()
    .format("HH:mm");
  let staUtc = moment
    .tz(
      `${date} ${seasonFlightData.sta}`,
      "YYYY-MM-DD HH:mm",
      process.env.TIME_ZONE,
    )
    .utc()
    .format("HH:mm");

  seasonFlightData.std = stdUtc;
  seasonFlightData.sta = staUtc;
  try {
    const gateCreated = await SeasonFlight.create(seasonFlightData);
    if (gateCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const seasonFlightData = req.body;

  if (seasonFlightData.direction_id == 1) {
    seasonFlightData.gate_id = null;
    seasonFlightData.counters = [];
  }
  if (seasonFlightData.direction_id == 2) {
    seasonFlightData.belt_id = null;
  }

  let date = moment().format("YYYY-MM-DD");
  let stdUtc = moment
    .tz(
      `${date} ${seasonFlightData.std}`,
      "YYYY-MM-DD HH:mm",
      process.env.TIME_ZONE,
    )
    .utc()
    .format("HH:mm");
  let staUtc = moment
    .tz(
      `${date} ${seasonFlightData.sta}`,
      "YYYY-MM-DD HH:mm",
      process.env.TIME_ZONE,
    )
    .utc()
    .format("HH:mm");
  seasonFlightData.std = stdUtc;
  seasonFlightData.sta = staUtc;

  try {
    const gateUpdated = await SeasonFlight.update(seasonFlightData, {
      where: {
        season_flight_id: id,
      },
    });
    if (gateUpdated) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const gateDelete = await SeasonFlight.destroy({
      where: {
        season_flight_id: id,
      },
    });

    if (!gateDelete) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Removed Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const normalizeSeasonFlightIds = (payload = {}) => {
  const candidates = [
    payload.season_flight_id,
    payload.id,
    payload.ids,
    payload.season_flight_ids,
  ];
  const raw = [];
  for (const item of candidates) {
    if (Array.isArray(item)) raw.push(...item);
    else if (typeof item === "string" && item.includes(",")) {
      raw.push(...item.split(",").map((v) => v.trim()));
    } else if (item !== undefined && item !== null && item !== "") {
      raw.push(item);
    }
  }
  const ids = raw
    .map((v) => Number(v))
    .filter((v) => Number.isInteger(v) && v > 0);
  return [...new Set(ids)];
};

const generateDailyBySeasonIds = async (req, res) => {
  const payload = req.body || {};
  const ids = normalizeSeasonFlightIds(payload);

  try {
    let targets = [];
    if (ids.length > 0) {
      targets = await SeasonFlight.findAll({
        where: { season_flight_id: { [Op.in]: ids } },
      });
      if (!targets.length) {
        return res.status(404).json({ message: "Item not found" });
      }
    } else {
      // Backward compatibility: old payload can pass a full season flight object.
      targets = [payload];
    }

    const allDailyFlights = [];
    const processedIds = [];
    for (const target of targets) {
      const row =
        typeof target.toJSON === "function" ? target.toJSON() : target;
      const itemsDailyFlights = await genSeasonToDaily(row);
      if (itemsDailyFlights.length > 0) {
        allDailyFlights.push(...itemsDailyFlights);
        if (row.season_flight_id)
          processedIds.push(Number(row.season_flight_id));
      }
    }

    if (!allDailyFlights.length) {
      return res.status(404).json({ message: "Item not found" });
    }

    await DailyFlight.bulkCreate(allDailyFlights, {
      ignoreDuplicates: true,
    });

    if (processedIds.length > 0) {
      await SeasonFlight.update(
        { is_active: true },
        {
          where: {
            season_flight_id: { [Op.in]: [...new Set(processedIds)] },
          },
        },
      );
    }

    return res.status(200).json({
      message: "Created Successfully",
      season_flight_ids: [...new Set(processedIds)],
      created_rows: allDailyFlights.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const unGenerateDailyBySeasonIds = async (req, res) => {
  const payload = req.body || {};
  const ids = normalizeSeasonFlightIds(payload);
  if (!ids.length) {
    return res.status(400).json({ message: "season_flight_id(s) is required" });
  }

  try {
    const dailyFlightDelete = await DailyFlight.destroy({
      where: {
        season_flight_id: { [Op.in]: ids },
      },
    });
    await SeasonFlight.update(
      { is_active: false },
      {
        where: {
          season_flight_id: { [Op.in]: ids },
        },
      },
    );

    return res.status(200).json({
      message: "Removed Successfully",
      season_flight_ids: ids,
      removed_daily_rows: dailyFlightDelete,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const downloadSeasonFlightImportTemplate = async (req, res) => {
  try {
    const templatePath = path.resolve(
      __dirname,
      "..",
      "files",
      "season_flights_import_template.xlsx",
    );

    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ message: "Template file not found" });
    }

    return res.download(templatePath, "season_flights_import_template.xlsx");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const importFileSeasonSchedule = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const isXlsxName = (file.originalname || "")
      .toLowerCase()
      .endsWith(".xlsx");
    if (!allowedMimeTypes.includes(file.mimetype) || !isXlsxName) {
      return res.status(409).json({ message: "Invalid file type" });
    }

    let filePath = `./uploads/` + file.filename;
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      return res
        .status(404)
        .json({ message: "No worksheet found in the file" });
    }

    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber] = String(cell.value || "").trim();
    });

    const data = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      const item = {};
      let hasValue = false;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const header = headers[colNumber];
        if (!header) return;

        const value =
          cell.value && cell.value.text ? cell.value.text : cell.value;
        if (value !== null && value !== undefined && value !== "") {
          hasValue = true;
        }
        item[header] = value;
      });

      if (hasValue) data.push(item);
    });

    if (!data.length) {
      return res.status(404).json({ message: "No data found in the file" });
    }

    const normalizeCellValue = (value) => {
      if (value === null || value === undefined) return null;
      if (value instanceof Date) return value;
      if (typeof value !== "object") return value;
      if (value.result !== undefined && value.result !== null)
        return value.result;
      if (value.text !== undefined && value.text !== null) return value.text;
      if (Array.isArray(value.richText)) {
        return value.richText.map((part) => part.text || "").join("");
      }
      return value;
    };

    const normalizeLookupValue = (value) => {
      const normalized = normalizeCellValue(value);
      if (normalized === null || normalized === undefined) return null;
      const raw = String(normalized).trim();
      return raw || null;
    };

    const getValueByAliases = (row, aliases = []) => {
      for (const key of aliases) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
          return row[key];
        }
      }
      return null;
    };

    const parseExcelDate = (value) => {
      const normalized = normalizeCellValue(value);
      if (normalized instanceof Date && !Number.isNaN(normalized.getTime())) {
        return moment(normalized).format("YYYY-MM-DD");
      }

      const raw = String(normalized || "").trim();
      if (!raw) return null;

      // template format: DDMMYYYY (e.g. 17032026)
      if (/^\d{8}$/.test(raw)) {
        const parsedDmy = moment(raw, "DDMMYYYY", true);
        if (parsedDmy.isValid()) return parsedDmy.format("YYYY-MM-DD");
      }

      // Excel serial date
      if (/^\d+(\.\d+)?$/.test(raw)) {
        return moment
          .utc("1899-12-30")
          .add(Number(raw), "days")
          .format("YYYY-MM-DD");
      }

      const parsed = moment(
        raw,
        [
          "YYYY-MM-DD",
          "DD/MM/YYYY",
          "D/M/YYYY",
          "MM/DD/YYYY",
          "M/D/YYYY",
          "DD-MM-YYYY",
          "D-M-YYYY",
        ],
        true,
      );
      return parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
    };

    const parseExcelTime = (value) => {
      const normalized = normalizeCellValue(value);
      if (normalized instanceof Date && !Number.isNaN(normalized.getTime())) {
        return moment(normalized).format("HH:mm");
      }

      const raw = String(normalized || "").trim();
      if (!raw) return null;

      // template format: 740, 0940, 1725
      if (/^\d{3,4}$/.test(raw)) {
        const padded = raw.padStart(4, "0");
        const hh = Number(padded.slice(0, 2));
        const mm = Number(padded.slice(2));
        if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
          return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        }
      }

      // Excel serial time (fraction of day)
      if (/^\d+(\.\d+)?$/.test(raw)) {
        const n = Number(raw);
        const minutes = Math.round((n % 1) * 24 * 60);
        if (minutes > 0) {
          return moment
            .utc("00:00", "HH:mm")
            .add(minutes, "minutes")
            .format("HH:mm");
        }
      }

      const parsed = moment(
        raw,
        ["HH:mm", "H:mm", "HH:mm:ss", "H:mm:ss", "hh:mm A", "h:mm A"],
        true,
      );
      return parsed.isValid() ? parsed.format("HH:mm") : null;
    };

    const parseCounterIds = (value) => {
      const normalized = normalizeCellValue(value);
      if (
        normalized === null ||
        normalized === undefined ||
        normalized === ""
      ) {
        return [];
      }

      if (Array.isArray(normalized)) {
        return normalized
          .map((item) => Number(String(item).trim()))
          .filter((item) => Number.isFinite(item));
      }

      return String(normalized)
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item));
    };

    const parseOperationDays = (value) => {
      const normalized = normalizeCellValue(value);
      if (
        normalized === null ||
        normalized === undefined ||
        normalized === ""
      ) {
        return [];
      }
      const raw = String(normalized).trim();
      if (!raw) return [];

      // template format: 1357 or 246
      if (/^\d+$/.test(raw) && !raw.includes(",")) {
        return raw
          .split("")
          .map((d) => Number(d))
          .filter((d) => Number.isInteger(d) && d >= 1 && d <= 7);
      }

      return raw
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((d) => Number.isInteger(d) && d >= 1 && d <= 7);
    };

    let items = [];

    for (let index = 0; index < data.length; index++) {
      const e = data[index];
      const rowNumber = index + 2;
      const routeRaw = getValueByAliases(e, ["route", "OriginDestination"]);
      const flightNoRaw = getValueByAliases(e, ["flightNo", "flight_no"]);
      const validFromRaw = getValueByAliases(e, ["validFrom", "valid_from"]);
      const validToRaw = getValueByAliases(e, ["validTo", "valid_to"]);
      const takeoffRaw = getValueByAliases(e, ["takeoff", "std"]);
      const landedRaw = getValueByAliases(e, ["landed", "sta"]);
      const dayOfWeekRaw = getValueByAliases(e, [
        "dayOfWeek",
        "operation_days",
      ]);

      const originDestination = String(routeRaw || "").trim();
      const flightNo = String(flightNoRaw || "").trim();
      const validFrom = parseExcelDate(validFromRaw);
      const validTo = parseExcelDate(validToRaw);
      const takeoffLocal = parseExcelTime(takeoffRaw);
      const landedLocal = parseExcelTime(landedRaw);
      const operationDays = parseOperationDays(dayOfWeekRaw);

      if (!originDestination || originDestination.length < 7) {
        return res
          .status(400)
          .json({ message: `Invalid OriginDestination at row ${rowNumber}` });
      }
      if (!flightNo) {
        return res
          .status(400)
          .json({ message: `Invalid flightNo at row ${rowNumber}` });
      }
      if (!validFrom || !validTo) {
        return res
          .status(400)
          .json({ message: `Invalid validFrom/validTo at row ${rowNumber}` });
      }
      if (!takeoffLocal || !landedLocal) {
        return res
          .status(400)
          .json({ message: `Invalid takeoff/landed time at row ${rowNumber}` });
      }
      if (!operationDays.length) {
        return res
          .status(400)
          .json({ message: `Invalid dayOfWeek at row ${rowNumber}` });
      }

      const terminalName = normalizeLookupValue(
        getValueByAliases(e, ["terminal"]),
      );
      const beltName = normalizeLookupValue(getValueByAliases(e, ["belt"]));
      const gateName = normalizeLookupValue(getValueByAliases(e, ["gate"]));

      let originAirportId = await Airport.findOne({
        where: { iata_code: originDestination.substring(0, 3) },
        attributes: ["airport_id"],
      }).then((res) => {
        return res ? res.airport_id : null;
      });
      let destinationAirportId = await Airport.findOne({
        where: { iata_code: originDestination.substring(4) },
        attributes: ["airport_id"],
      }).then((res) => {
        return res ? res.airport_id : null;
      });
      let airlineId = await Airline.findOne({
        where: { iata_code: flightNo.substring(0, 2) },
        attributes: ["airline_id"],
      }).then((res) => {
        return res ? res.airline_id : null;
      });
      const aircraftTypeCode = normalizeLookupValue(
        getValueByAliases(e, ["aircraftType", "aircraft_type"]),
      );
      let aircraftTypeId = await AircraftType.findOne({
        where: { iata_code: aircraftTypeCode },
        attributes: ["aircraft_type_id"],
      }).then((res) => {
        return res ? res.aircraft_type_id : null;
      });
      let terminalId = await Terminal.findOne({
        where: { name: terminalName },
        attributes: ["terminal_id"],
      }).then((res) => {
        return res ? res.terminal_id : null;
      });
      let beltId = null;
      if (beltName) {
        beltId = await Belt.findOne({
          where: { name: beltName },
          attributes: ["belt_id"],
        }).then((res) => {
          return res ? res.belt_id : null;
        });
      }
      let gateId = null;
      if (gateName) {
        gateId = await Gate.findOne({
          where: { name: gateName },
          attributes: ["gate_id"],
        }).then((res) => {
          return res ? res.gate_id : null;
        });
      }
      let counterIds = parseCounterIds(
        getValueByAliases(e, ["counter", "counters"]),
      );
      let directionId = null;
      const directionRaw = String(getValueByAliases(e, ["direction"]) || "")
        .trim()
        .toLowerCase();
      if (directionRaw === "in" || directionRaw === "arrival") {
        directionId = 1;
        gateId = null;
        counterIds = [];
      } else if (directionRaw === "out" || directionRaw === "departure") {
        directionId = 2;
        beltId = null;
      }
      let flightCategoryId = null;
      const categoryRaw = String(getValueByAliases(e, ["category"]) || "")
        .trim()
        .toLowerCase();
      if (categoryRaw === "domestic" || categoryRaw === "dom") {
        flightCategoryId = 1;
      } else if (categoryRaw === "international" || categoryRaw === "inter") {
        flightCategoryId = 2;
      }

      // console.log("originAirportId", originAirportId);
      // console.log("destinationAirportId", destinationAirportId);
      // console.log("airlineId", airlineId);
      // console.log("aircraftTypeId", aircraftTypeId);
      // console.log("terminalId", terminalId);
      // console.log("beltId", beltId);
      // console.log("gateId", gateId);
      // console.log("counterIds", counterIds);
      // console.log("directionId", directionId);
      // console.log("flightCategoryId", flightCategoryId);

      let item = {
        origin_airport_id: originAirportId,
        destination_airport_id: destinationAirportId,
        airline_id: airlineId,
        aircraft_type_id: aircraftTypeId,
        direction_id: directionId,
        flight_category_id: flightCategoryId,
        terminal_id: terminalId,
        belt_id: beltId,
        gate_id: gateId,
        counters: counterIds,
        flight_no: flightNo,
        valid_from: validFrom,
        valid_to: validTo,
        std: moment
          .tz(takeoffLocal, "HH:mm", process.env.TIME_ZONE)
          .utc()
          .format("HH:mm"),
        sta: moment
          .tz(landedLocal, "HH:mm", process.env.TIME_ZONE)
          .utc()
          .format("HH:mm"),
        operation_days: operationDays,
        is_import: Boolean(true),
        remark: e.remark || null,
        is_active: Boolean(false),
      };

      // console.log("timezone", process.env.TIME_ZONE);
      items.push(item);
    }

    const seasonFlightCreated = await SeasonFlight.bulkCreate(items, {
      ignoreDuplicates: true,
    });
    if (seasonFlightCreated) {
      return res.status(200).json({ message: "Created Successfully" });
    }
    res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// function
async function genSeasonToDaily(seasonFlight) {
  const {
    season_flight_id,
    flight_no,
    valid_from,
    valid_to,
    std,
    sta,
    operation_days,
    origin_airport_id,
    destination_airport_id,
    airline_id,
    aircraft_type_id,
    direction_id,
    flight_category_id,
    terminal_id,
    belt_id,
    gate_id,
    counters,
    flight_status_id,
    flight_date,
    operation_day,
    remark,
    is_active,
  } = seasonFlight;

  const start = moment(valid_from, "YYYY-MM-DD");
  const end = moment(valid_to, "YYYY-MM-DD");
  const dailyFlights = [];
  const timeOnlyFormats = ["HH:mm:ss", "HH:mm"];
  const dateTimeFormats = ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD HH:mm"];
  const formatTimeForDb = (timeValue) => {
    const parsed = moment(timeValue, timeOnlyFormats, true);
    return parsed.isValid() ? parsed.format("HH:mm:ss") : null;
  };
  const shiftTime = (timeValue, minutes, operation = "add") => {
    const parsed = moment(timeValue, timeOnlyFormats, true);
    if (!parsed.isValid()) return null;
    return parsed[operation](Number(minutes) || 0, "minutes").format(
      "HH:mm:ss",
    );
  };

  for (
    let date = start.clone();
    date.isSameOrBefore(end);
    date.add(1, "days")
  ) {
    const dayOfWeek = date.isoWeekday(); // Monday=1, Sunday=7
    if (operation_days.includes(dayOfWeek)) {
      const stdDateTime = std;
      const staDateTime = sta;

      const airline = await Airline.findOne({
        where: { airline_id: airline_id },
      });
      let checkin_open = null;
      let checkin_close = null;
      let boarding_time = null;
      let first_bag = null;
      let last_bag = null;

      if (flight_category_id == 1) {
        // Domestic
        if (direction_id == 1) {
          first_bag = shiftTime(staDateTime, airline.first_bag_dom, "add");
          last_bag = shiftTime(staDateTime, airline.last_bag_dom, "add");
        } else if (direction_id == 2) {
          checkin_open = shiftTime(
            stdDateTime,
            airline.checkin_open_dom,
            "subtract",
          );
          checkin_close = shiftTime(
            stdDateTime,
            airline.checkin_close_dom,
            "subtract",
          );
          boarding_time = shiftTime(
            stdDateTime,
            airline.boarding_time_dom,
            "subtract",
          );
        }
      } else if (flight_category_id == 2) {
        // International
        if (direction_id == 1) {
          first_bag = shiftTime(staDateTime, airline.first_bag_inter, "add");
          last_bag = shiftTime(staDateTime, airline.last_bag_inter, "add");
        } else if (direction_id == 2) {
          checkin_open = shiftTime(
            stdDateTime,
            airline.checkin_open_inter,
            "subtract",
          );
          checkin_close = shiftTime(
            stdDateTime,
            airline.checkin_close_inter,
            "subtract",
          );
          boarding_time = shiftTime(
            stdDateTime,
            airline.boarding_time_inter,
            "subtract",
          );
        }
      }

      dailyFlights.push({
        season_flight_id,
        origin_airport_id,
        destination_airport_id,
        airline_id,
        aircraft_type_id,
        direction_id,
        flight_category_id,
        terminal_id,
        belt_id,
        gate_id,
        counters,
        flight_status_id: 1,
        flight_no,
        flight_date: date.format("YYYY-MM-DD"),
        std: formatTimeForDb(stdDateTime),
        sta: formatTimeForDb(staDateTime),
        etd: formatTimeForDb(stdDateTime),
        eta: formatTimeForDb(staDateTime),
        atd: null,
        ata: null,
        checkin_open: formatTimeForDb(checkin_open),
        checkin_close: formatTimeForDb(checkin_close),
        boarding_time: formatTimeForDb(boarding_time),
        first_bag: formatTimeForDb(first_bag),
        last_bag: formatTimeForDb(last_bag),
        operation_day: dayOfWeek,
        is_active: false,
      });
    }
  }

  return dailyFlights;
}

module.exports = {
  find,
  findOne,
  create,
  update,
  remove,
  generateDailyBySeasonIds,
  unGenerateDailyBySeasonIds,
  downloadSeasonFlightImportTemplate,
  importFileSeasonSchedule,
};
