# pg-dump-restore-nodejs

forked from @endodata

This very small utility that includes pg_dump and pg_restore binaries for Windows, Linux and macOS, taken from Postgres 14. DLLs and dylibs are also included, making the binaries standalone.

A thin CLI wrapper is also provided.

Modified https://github.com/AmitBar2001/pg-dump-restore-node-wrapper project to add the Linux binaries and add the option to generate the .sql with INSERT

## Usage

```js
import pgDumpRestore from "pg-dump-restore-nodejs";

async function main() {
  const { stdout, stderr } = await pgDumpRestore.dump({
    port, // defaults to 5432
    host,
    dbname,
    username,
    password,
    file: "./test.pgdump",
    format, // defaults to 'c'
    parameters
  }); // outputs an execa object

  const { stdout, stderr } = await pgDumpRestore.restore({
    port, // defaults to 5432
    host,
    dbname,
    username,
    password,
    filename: "./test.pgdump", // note the filename instead of file, following the pg_restore naming.
    clean, // defaults to false
    create, // defaults to false
  }); // outputs an execa object
}
```

Please see the [pg_dump](https://www.postgresql.org/docs/14/app-pgdump.html) and [pg_restore](https://www.postgresql.org/docs/14/app-pgrestore.html) documentation for details on the arguments and [execa](https://github.com/sindresorhus/execa) for details on the output streams.

## Creating the binaries

pg_dump V<=X can be restored using pg_restore V>=X.

I chose to use pg_dump and pg_restore for Postgres 14, as most of the machines I manage have Postgres 14.

### macOS

I used macdylibbundler from https://github.com/SCG82/macdylibbundler to list all dll files and I then copied and renamed them.

I did not use the tool to bundle the dependencies as it would corrupt the executable.

### Windows

I used https://github.com/lucasg/Dependencies to determine the required DLL, filtering only the local dependencies.

### Linux

I have used it to obtain the Linux binaries from an Ubuntu 22.04 installation of the postgresql client locally

## To publish to GHCR

Add this to `package.json`
```json
  "publishConfig": {
    "registry":"https://npm.pkg.github.com"
  },
```

and add a `.npmrc` to the root of the repo with 
```.npmrc
//npm.pkg.github.com/:_authToken=AUTH_TOKEN
```
Where `AUTH_TOKEN` is replaced with a GitHub token.