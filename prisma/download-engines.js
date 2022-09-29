const path = require("path");
const { download } = require("@prisma/fetch-engine");

(async () => {
  process.env.PATCH_BRANCH = "master";
  await download({
    binaries: {
      "migration-engine": path.resolve("./node_modules/@prisma/engines/"),
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
