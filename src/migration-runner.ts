import { Handler } from "aws-lambda";
import { execFile } from "child_process";
import path from "path";

export const handler: Handler = async (event, _) => {
  console.log(event)
  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate
  const command: string = event.command ?? "deploy";

  let options: string[] = [];

  if (command == "reset") {
    // skip confirmation and code generation
    options = ["--force", "--skip-generate"];
  }

  // Currently we don't have any direct method to invoke prisma migration programmatically.
  // As a workaround, we spawn migration script as a child process and wait for its completion.
  // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
  try {
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
    // https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
    
    console.log('prisma migrate ' + command + ' ' + options.join(' '));

    const exitCode = await new Promise((resolve, _) => {
      execFile(
        path.resolve("./node_modules/prisma/build/index.js"),
        ["migrate", command].concat(options),
        (error, stdout, stderr) => {
          console.log(stdout);
          console.error(stderr);
          if (error != null) {
            console.log(`prisma migrate ${command} exited with error ${error.message}`);
            resolve(error.code ?? 1);
          } else {
            resolve(0);
          }
        },
      );
    });

    if (exitCode != 0) throw Error(`command ${command} failed with exit code ${exitCode}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
