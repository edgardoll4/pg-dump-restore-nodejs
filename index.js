const execa = require("execa");
// import { execa } from "execa";
const path = require("path");
// import { path } from "path";

let os = '';
switch (process.platform) {
  case "win32":
    os = "win";
    break;
  case "darwin":
    os = "mac";
    break;
  case "linux":
    os = "linux";
    break;
  case "freebsd":
    os = "freebsd";
    break;
  case "openbsd":
    os = "openbsd";
    break;
  case "sunos":
    os = "sunos";
    break;
  default:
    break;
}
let arch = '';
switch (process.arch) {
  case "x64":
    arch = "x64";
    break;
  case "x32":
    arch = "x86";
    break;
  case "arm":
    arch = "arm";
    break;
  case "arm64":
    arch = "arm64";
    break;
  default:
    break;
}
let auxbinariesPath = '';

if (os != 'linux'){
  auxbinariesPath = path.join(
    __dirname,
    "bin",
    os,
    "bin"
  );
}else {
  binariesPath = '';
}
let binariesPath = auxbinariesPath;

let pgRestorePath ='';
let pgDumpPath = '';

if (os != 'linux'){
  pgRestorePath = path.join(
    binariesPath,
    os === "win" ? "pg_restore.exe" : "pg_restore"
  );
  pgDumpPath = path.join(
    binariesPath,
    os === "win" ? "pg_dump.exe" : "pg_dump"
  );
}else {
  pgRestorePath = "pg_restore";
  pgDumpPath = "pg_dump";
}

const dump = function ({
  port = 5432,
  host,
  dbname,
  username,
  password,
  file,
  format = "c",
  parameters,
}) {
  let args = [];
  if (parameters)
    args.push(parameters);
  if (password) {
    if (!(username && password && host && port && dbname)) {
      throw new Error(
        "When password is provided, username, password, host, port and dbname must be provided"
      );
    }
    let url = `postgresql://${username}:${password}@${host}:${port}/${dbname}`;
    args.push("--dbname");
    args.push(url);
  } else {
    if (host) {
      args.push("--host");
      args.push(host);
    }
    if (port) {
      args.push("--port");
      args.push(port);
    }
    if (dbname) {
      args.push("--dbname");
      args.push(dbname);
    }
    if (username) {
      args.push("--username");
      args.push(username);
    }
    if (password) {
      args.push("--password");
      args.push(password);
    }
  }

  if (file) {
    args.push("--file");
    args.push(file);
  }
  if (format) {
    args.push("--format");
    args.push(format);
  }
  return execa(pgDumpPath, args, {});
};
const restore = function ({
  port = 5432,
  host,
  dbname,
  username,
  password,
  filename,
  clean,
  create,
}) {
  let args = [];
  if (password) {
    if (!(username && password && host && port && dbname)) {
      throw new Error(
        "When password is provided, username, password, host, port and dbname must be provided"
      );
    }
    let url = `postgresql://${username}:${password}@${host}:${port}/${dbname}`;
    args.push("--dbname");
    args.push(url);
  } else {
    if (host) {
      args.push("--host");
      args.push(host);
    }
    if (port) {
      args.push("--port");
      args.push(port);
    }
    if (dbname) {
      args.push("--dbname");
      args.push(dbname);
    }
    if (username) {
      args.push("--username");
      args.push(username);
    }
    if (password) {
      args.push("--password");
      args.push(password);
    }
  }

  if (clean) {
    args.push("--clean");
  }
  if (create) {
    args.push("--create");
  }
  if (!filename) {
    throw new Error("Needs filename in the options");
  }
  args.push(filename);
  return execa(pgRestorePath, args, {});
};

module.exports = { dump, restore, pgRestorePath, pgDumpPath };
