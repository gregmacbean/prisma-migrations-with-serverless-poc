const { resolve, join } = require("path");
const fse = require("fs-extra");
const glob = require("fast-glob");
const { download } = require("@prisma/fetch-engine");

const engines = [
  "node_modules/.prisma/client/libquery_engine*",
  "!node_modules/.prisma/client/libquery_engine-rhel*",

  "node_modules/prisma/libquery_engine*",
  "!node_modules/prisma/libquery_engine-rhel*",

  "node_modules/@prisma/engines/libquery_engine*",
  "!node_modules/@prisma/engines/libquery_engine-rhel*",

  "node_modules/@prisma/engines/migration-engine*",
  "!node_modules/@prisma/engines/migration-engine-rhel*",

  "node_modules/@prisma/engines/prisma-fmt*",
  "!node_modules/@prisma/engines/prisma-fmt-rhel*",

  "node_modules/@prisma/engines/introspection-engine*",
  "!node_modules/@prisma/engines/introspection-engine-rhel*",
];

function removeUnusedEngines() {
  const cwd = resolve(".");
  const unusedEngines = glob.sync(engines, { cwd });
  if (unusedEngines.length <= 0) return;
  console.log(`Remove unused prisma engine:`);
  unusedEngines.forEach((engine) => {
    console.log(`  - ${engine}`);
    const enginePath = join(cwd, engine);
    fse.removeSync(enginePath, { force: true });
  });
}

(async () => {
  process.env.PATCH_BRANCH = "master";

  removeUnusedEngines();

  await download({
    binaries: {
      "migration-engine": resolve("./node_modules/@prisma/engines/"),
    },
    binaryTargets: ["rhel-openssl-1.0.x"],
    ignoreCache: true,
    printVersion: true,
    failSilent: false,
    showProgress: true,
    progressCb: (downloaded, total) => {
      console.log(`Downloaded ${downloaded} of ${total} bytes`);
    },
  });

  process.exit();
})();
